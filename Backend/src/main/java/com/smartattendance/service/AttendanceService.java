package com.smartattendance.service;

import com.smartattendance.config.AppProperties;
import com.smartattendance.dto.attendance.AttendanceResponse;
import com.smartattendance.dto.attendance.AutoAttendanceResponse;
import com.smartattendance.dto.attendance.ClassReportResponse;
import com.smartattendance.dto.attendance.MarkAttendanceRequest;
import com.smartattendance.dto.attendance.StudentAttendanceEntry;
import com.smartattendance.entity.Attendance;
import com.smartattendance.entity.AttendanceStatus;
import com.smartattendance.entity.Student;
import com.smartattendance.repository.AttendanceRepository;
import com.smartattendance.repository.StudentRepository;
import jakarta.transaction.Transactional;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AttendanceService {
    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final AppProperties props;
    private final RestTemplate restTemplate;

    public AttendanceService(AttendanceRepository attendanceRepository, StudentRepository studentRepository,
            AppProperties props) {
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
        this.props = props;
        this.restTemplate = new RestTemplate();
    }

    @Transactional
    public AttendanceResponse mark(MarkAttendanceRequest req) {
        Student student = studentRepository.findById(req.getStudentId())
                .orElseThrow(() -> new com.smartattendance.exception.NotFoundException("Student not found"));

        Attendance a = attendanceRepository.findByStudent_IdAndDate(student.getId(), req.getDate())
                .orElseGet(() -> {
                    Attendance na = new Attendance();
                    na.setStudent(student);
                    na.setDate(req.getDate());
                    return na;
                });

        a.setStatus(req.getStatus());
        Attendance saved = attendanceRepository.save(a);
        return new AttendanceResponse(saved.getId(), student.getId(), saved.getDate(), saved.getStatus(), true);
    }

    public AttendanceResponse getByStudentAndDate(UUID studentId, LocalDate date) {
        return attendanceRepository.findByStudent_IdAndDate(studentId, date)
                .map(a -> new AttendanceResponse(a.getId(), a.getStudent().getId(), a.getDate(), a.getStatus(), true))
                .orElseGet(() -> new AttendanceResponse(null, studentId, date, AttendanceStatus.ABSENT, false));
    }

    public ClassReportResponse classReport(LocalDate date) {
        List<Student> students = studentRepository.findAll();
        List<Attendance> records = attendanceRepository.findByDate(date);

        Map<UUID, Attendance> byStudent = new HashMap<>();
        for (Attendance a : records) {
            byStudent.put(a.getStudent().getId(), a);
        }

        List<StudentAttendanceEntry> entries = students.stream()
                .map(s -> {
                    Attendance a = byStudent.get(s.getId());
                    if (a == null) {
                        return new StudentAttendanceEntry(null, s.getId(), s.getRollNumber(), s.getUser().getName(),
                                AttendanceStatus.ABSENT, false);
                    }
                    return new StudentAttendanceEntry(a.getId(), s.getId(), s.getRollNumber(), s.getUser().getName(),
                            a.getStatus(), true);
                })
                .sorted(Comparator.comparing(StudentAttendanceEntry::getRollNumber,
                        Comparator.nullsLast(String::compareToIgnoreCase)))
                .collect(Collectors.toList());

        int present = (int) entries.stream().filter(e -> e.getStatus() == AttendanceStatus.PRESENT).count();
        int total = entries.size();
        int absent = total - present;

        return new ClassReportResponse(date, total, present, absent, entries);
    }

    public List<AttendanceResponse> getRange(UUID studentId, LocalDate from, LocalDate to) {
        if (from == null || to == null) {
            throw new IllegalArgumentException("from and to are required");
        }
        if (to.isBefore(from)) {
            throw new IllegalArgumentException("to must be on/after from");
        }

        studentRepository.findById(studentId).orElseThrow(() -> new com.smartattendance.exception.NotFoundException("Student not found"));

        List<Attendance> records = attendanceRepository.findByStudent_IdAndDateBetweenOrderByDateAsc(studentId, from, to);
        return records.stream()
                .map(a -> new AttendanceResponse(a.getId(), a.getStudent().getId(), a.getDate(), a.getStatus(), true))
                .collect(Collectors.toList());
    }

    @Transactional
    public AutoAttendanceResponse autoAttendance(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required");
        }

        // 1. Call ML Service
        List<Map<String, Object>> recognizedUsers;
        try {
            recognizedUsers = callMlService(file);
        } catch (Exception e) {
            throw new RuntimeException("ML service unavailable or error occurred", e);
        }

        // 2. Filter by confidence >= 0.6
        Set<String> presentUserIds = recognizedUsers == null ? Set.of() : recognizedUsers.stream()
                .filter(m -> {
                    Object conf = m.get("confidence");
                    if (conf instanceof Number) {
                        return ((Number) conf).doubleValue() >= 0.6;
                    }
                    return false;
                })
                .map(m -> (String) m.get("user_id"))
                .collect(Collectors.toSet());

        // 3. Fetch all ACTIVE students (must have roll number and image)
        List<Student> allStudents = studentRepository.findAll().stream()
                .filter(s -> s.getRollNumber() != null && !s.getRollNumber().startsWith("TEMP_"))
                .filter(s -> s.getImageUrl() != null)
                .toList();
        
        if (allStudents.isEmpty()) {
            return new AutoAttendanceResponse(LocalDate.now(), 0, 0, 0, List.of());
        }

        LocalDate today = LocalDate.now();

        // 4. Mark attendance
        List<StudentAttendanceEntry> details = new ArrayList<>();
        int presentCount = 0;

        for (Student s : allStudents) {
            String userIdStr = s.getUser().getId().toString();
            AttendanceStatus status = presentUserIds.contains(userIdStr) ? AttendanceStatus.PRESENT : AttendanceStatus.ABSENT;

            Attendance a = attendanceRepository.findByStudent_IdAndDate(s.getId(), today)
                    .orElseGet(() -> {
                        Attendance na = new Attendance();
                        na.setStudent(s);
                        na.setDate(today);
                        return na;
                    });

            a.setStatus(status);
            Attendance saved = attendanceRepository.save(a);

            if (status == AttendanceStatus.PRESENT) {
                presentCount++;
            }

            details.add(new StudentAttendanceEntry(
                    saved.getId(),
                    s.getId(),
                    s.getRollNumber(),
                    s.getUser().getName(),
                    status,
                    true));
        }

        int total = allStudents.size();
        int absent = total - presentCount;

        return new AutoAttendanceResponse(today, total, presentCount, absent, details);
    }

    private List<Map<String, Object>> callMlService(MultipartFile file) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        };
        body.add("file", resource);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        String url = props.getMl().getServiceUrl() + "/recognize";

        return restTemplate.exchange(
                url,
                org.springframework.http.HttpMethod.POST,
                requestEntity,
                new ParameterizedTypeReference<List<Map<String, Object>>>() {
                }).getBody();
    }
}
