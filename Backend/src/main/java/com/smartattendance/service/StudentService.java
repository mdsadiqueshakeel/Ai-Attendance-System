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
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.List;
import java.util.Locale;
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

    public List<StudentResponse> listAll() {
        return studentRepository.findAll()
                .stream()
                .map(StudentService::toResponse)
                .toList();
    }

    @Transactional
    public StudentResponse uploadImage(UUID studentId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is required");
        }
        if (file.getSize() > MAX_IMAGE_BYTES) {
            throw new BadRequestException("File too large (max 10MB)");
        }

        String contentType = file.getContentType();
        if (contentType == null) contentType = "";
        contentType = contentType.toLowerCase(Locale.ROOT);
        String ext = switch (contentType) {
            case "image/jpeg", "image/jpg" -> "jpg";
            case "image/png" -> "png";
            default -> null;
        };
        if (ext == null) {
            throw new BadRequestException("Only JPEG and PNG images are allowed");
        }

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new NotFoundException("Student not found"));

        Path root = Path.of(props.getUpload().getDir()).toAbsolutePath().normalize();
        Path studentDir = root.resolve("students").resolve(studentId.toString());
        try {
            Files.createDirectories(studentDir);
            String filename = "face_" + Instant.now().toEpochMilli() + "." + ext;
            Path dest = studentDir.resolve(filename).normalize();

            // Safety: ensure path stays within the upload root.
            if (!dest.startsWith(root)) {
                throw new BadRequestException("Invalid upload path");
            }

            try (InputStream in = file.getInputStream()) {
                Files.copy(in, dest, StandardCopyOption.REPLACE_EXISTING);
            }

            // Store an app-relative path for portability (served via /files/**)
            String relative = root.relativize(dest).toString().replace("\\", "/");
            student.setImageUrl("/files/" + relative);
            Student saved = studentRepository.save(student);
            return toResponse(saved);
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
                s.getImageUrl()
        );
    }
}
