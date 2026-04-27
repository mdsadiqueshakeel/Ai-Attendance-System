package com.smartattendance.service;

import com.smartattendance.config.AppProperties;
import com.smartattendance.dto.student.CreateStudentRequest;
import com.smartattendance.dto.student.StudentResponse;
import com.smartattendance.entity.Student;
import com.smartattendance.entity.User;
import com.smartattendance.entity.UserRole;
import com.smartattendance.exception.BadRequestException;
import com.smartattendance.exception.ConflictException;
import com.smartattendance.exception.NotFoundException;
import com.smartattendance.repository.StudentRepository;
import com.smartattendance.repository.UserRepository;
import jakarta.transaction.Transactional;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

@Service
public class StudentService {
    private static final long MAX_IMAGE_BYTES = 10L * 1024 * 1024;

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final AppProperties props;

    public StudentService(StudentRepository studentRepository, UserRepository userRepository, AppProperties props) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.props = props;
    }

    @Transactional
    public StudentResponse create(CreateStudentRequest req) {
        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new NotFoundException("User not found"));
        if (user.getRole() != UserRole.STUDENT) {
            throw new BadRequestException("User role must be STUDENT to create a student profile");
        }
        if (studentRepository.findByUser_Id(user.getId()).isPresent()) {
            throw new ConflictException("Student profile already exists for this user");
        }

        String roll = req.getRollNumber().trim();
        if (studentRepository.existsByRollNumberIgnoreCase(roll)) {
            throw new ConflictException("Roll number already exists");
        }

        Student s = new Student();
        s.setUser(user);
        s.setRollNumber(roll);
        Student saved = studentRepository.save(s);
        return toResponse(saved);
    }

    /**
     * Returns all STUDENT users, even if they don't yet have a Student profile
     * (roll number/image may be null and studentId may be null).
     */
    public List<StudentResponse> listAll() {
        List<User> studentUsers = userRepository.findByRoleOrderByNameAsc(UserRole.STUDENT);
        if (studentUsers.isEmpty()) {
            return List.of();
        }

        List<UUID> userIds = studentUsers.stream().map(User::getId).toList();
        List<Student> profiles = studentRepository.findByUser_IdIn(userIds);
        Map<UUID, Student> byUserId = new HashMap<>();
        for (Student s : profiles) {
            if (s.getUser() != null) {
                byUserId.put(s.getUser().getId(), s);
            }
        }

        return studentUsers.stream()
                .map(u -> {
                    Student s = byUserId.get(u.getId());
                    if (s == null) {
                        return new StudentResponse(
                                null,
                                u.getId(),
                                u.getName(),
                                u.getEmail(),
                                null,
                                null);
                    }
                    return toResponse(s);
                })
                .toList();
    }

    @Transactional
    public StudentResponse uploadImage(UUID studentId, MultipartFile file) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new NotFoundException("Student not found"));
        Student saved = saveStudentImage(student, file);
        return toResponse(saved);
    }

    public Student requireByUserId(UUID userId) {
        return studentRepository.findByUser_Id(userId)
                .orElseThrow(() -> new NotFoundException("Student profile not found for this user"));
    }

    @Transactional
    public StudentResponse updateMyRollNumber(UUID userId, String rollNumber) {
        Student s = requireByUserId(userId);
        String roll = rollNumber == null ? "" : rollNumber.trim();
        if (roll.isBlank()) {
            throw new BadRequestException("rollNumber is required");
        }
        if (roll.length() > 50) {
            throw new BadRequestException("rollNumber too long (max 50)");
        }
        if (studentRepository.existsByRollNumberIgnoreCaseAndIdNot(roll, s.getId())) {
            throw new ConflictException("Roll number already exists");
        }
        s.setRollNumber(roll);
        return toResponse(studentRepository.save(s));
    }

    @Transactional
    public StudentResponse uploadMyImage(UUID userId, MultipartFile file) {
        Student s = requireByUserId(userId);
        Student saved = saveStudentImage(s, file);
        return toResponse(saved);
    }

    private Student saveStudentImage(Student student, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is required");
        }
        if (file.getSize() > MAX_IMAGE_BYTES) {
            throw new BadRequestException("File too large (max 10MB)");
        }

        String contentType = file.getContentType();
        if (contentType == null)
            contentType = "";
        contentType = contentType.toLowerCase(Locale.ROOT);
        String ext = switch (contentType) {
            case "image/jpeg", "image/jpg" -> "jpg";
            case "image/png" -> "png";
            default -> null;
        };
        if (ext == null) {
            throw new BadRequestException("Only JPEG and PNG images are allowed");
        }

        Path root = Path.of(props.getUpload().getDir()).toAbsolutePath().normalize();
        Path studentDir = root.resolve("students").resolve(student.getId().toString());
        try {
            Files.createDirectories(studentDir);
            String filename = "face_" + Instant.now().toEpochMilli() + ".jpg";
            Path dest = studentDir.resolve(filename).normalize();

            if (!dest.startsWith(root)) {
                throw new BadRequestException("Invalid upload path");
            }

            try (InputStream in = file.getInputStream()) {
                Thumbnails.of(in)
                        .size(800, 800)
                        .keepAspectRatio(true)
                        .outputFormat("jpg")
                        .outputQuality(0.7)
                        .toFile(dest.toFile());
            }

            String relative = root.relativize(dest).toString().replace("\\", "/");
            student.setImageUrl("/files/" + relative);
            return studentRepository.save(student);
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload image", e);
        }
    }

    private static StudentResponse toResponse(Student s) {
        User u = s.getUser();
        return new StudentResponse(
                s.getId(),
                u.getId(),
                u.getName(),
                u.getEmail(),
                s.getRollNumber(),
                s.getImageUrl());
    }
}
