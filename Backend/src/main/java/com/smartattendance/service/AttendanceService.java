package com.smartattendance.service;

import com.smartattendance.dto.attendance.AttendanceResponse;
import com.smartattendance.dto.attendance.ClassReportResponse;
import com.smartattendance.dto.attendance.MarkAttendanceRequest;
import com.smartattendance.dto.attendance.StudentAttendanceEntry;
import com.smartattendance.entity.Attendance;
import com.smartattendance.entity.AttendanceStatus;
import com.smartattendance.entity.Student;
import com.smartattendance.exception.NotFoundException;
import com.smartattendance.repository.AttendanceRepository;
import com.smartattendance.repository.StudentRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class AttendanceService {
    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    public AttendanceService(AttendanceRepository attendanceRepository, StudentRepository studentRepository) {
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
    }

    @Transactional
    public AttendanceResponse mark(MarkAttendanceRequest req) {
        Student student = studentRepository.findById(req.getStudentId())
                .orElseThrow(() -> new NotFoundException("Student not found"));

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
        // If there is no row, we treat as ABSENT (unmarked) for reporting convenience.
        return attendanceRepository.findByStudent_IdAndDate(studentId, date)
                .map(a -> new AttendanceResponse(a.getId(), a.getStudent().getId(), a.getDate(), a.getStatus(), true))
                .orElseGet(() -> new AttendanceResponse(null, studentId, date, AttendanceStatus.ABSENT, false));
    }

    public ClassReportResponse classReport(LocalDate date) {
        List<Student> students = studentRepository.findAll(); // entity graph includes user
        List<Attendance> records = attendanceRepository.findByDate(date); // entity graph includes student+user

        Map<UUID, Attendance> byStudent = new HashMap<>();
        for (Attendance a : records) {
            byStudent.put(a.getStudent().getId(), a);
        }

        List<StudentAttendanceEntry> entries = students.stream()
                .map(s -> {
                    Attendance a = byStudent.get(s.getId());
                    if (a == null) {
                        return new StudentAttendanceEntry(null, s.getId(), s.getRollNumber(), s.getUser().getName(), AttendanceStatus.ABSENT, false);
                    }
                    return new StudentAttendanceEntry(a.getId(), s.getId(), s.getRollNumber(), s.getUser().getName(), a.getStatus(), true);
                })
                .sorted(Comparator.comparing(StudentAttendanceEntry::getRollNumber, Comparator.nullsLast(String::compareToIgnoreCase)))
                .toList();

        int present = (int) entries.stream().filter(e -> e.getStatus() == AttendanceStatus.PRESENT).count();
        int total = entries.size();
        int absent = total - present;

        return new ClassReportResponse(date, total, present, absent, entries);
    }
}

