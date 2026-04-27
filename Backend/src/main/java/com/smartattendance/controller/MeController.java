package com.smartattendance.controller;

import com.smartattendance.dto.attendance.AttendanceResponse;
import com.smartattendance.dto.me.UpdateMeRequest;
import com.smartattendance.dto.me.MeResponse;
import com.smartattendance.dto.me.MyStudentResponse;
import com.smartattendance.dto.me.UpdateMyRollNumberRequest;
import com.smartattendance.entity.User;
import com.smartattendance.exception.NotFoundException;
import com.smartattendance.repository.UserRepository;
import com.smartattendance.security.SecurityUtils;
import com.smartattendance.service.AttendanceService;
import com.smartattendance.service.StudentService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/me")
public class MeController {
    private final UserRepository userRepository;
    private final StudentService studentService;
    private final AttendanceService attendanceService;

    public MeController(UserRepository userRepository, StudentService studentService,
            AttendanceService attendanceService) {
        this.userRepository = userRepository;
        this.studentService = studentService;
        this.attendanceService = attendanceService;
    }

    @GetMapping
    public MeResponse me() {
        UUID userId = SecurityUtils.currentUserId();
        User u = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));
        return new MeResponse(u.getId(), u.getName(), u.getEmail(), u.getRole());
    }

    @PatchMapping
    public MeResponse updateMe(@Valid @RequestBody UpdateMeRequest req) {
        UUID userId = SecurityUtils.currentUserId();
        User u = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        // Check if email is already taken by another user
        if (!u.getEmail().equalsIgnoreCase(req.getEmail())) {
            if (userRepository.existsByEmailIgnoreCase(req.getEmail())) {
                throw new com.smartattendance.exception.ConflictException("Email already taken");
            }
            u.setEmail(req.getEmail().toLowerCase());
        }

        u.setName(req.getName());
        User saved = userRepository.save(u);
        return new MeResponse(saved.getId(), saved.getName(), saved.getEmail(), saved.getRole());
    }

    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    public MyStudentResponse myStudentProfile() {
        UUID userId = SecurityUtils.currentUserId();
        var s = studentService.requireByUserId(userId);
        return new MyStudentResponse(s.getId(), s.getRollNumber(), s.getImageUrl());
    }

    @GetMapping("/attendance")
    @PreAuthorize("hasRole('STUDENT')")
    public AttendanceResponse myAttendanceForDate(
            @RequestParam("date") @NotNull @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        UUID userId = SecurityUtils.currentUserId();
        var s = studentService.requireByUserId(userId);
        return attendanceService.getByStudentAndDate(s.getId(), date);
    }

    @GetMapping("/attendance/range")
    @PreAuthorize("hasRole('STUDENT')")
    public List<AttendanceResponse> myAttendanceRange(
            @RequestParam("from") @NotNull @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam("to") @NotNull @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        UUID userId = SecurityUtils.currentUserId();
        var s = studentService.requireByUserId(userId);
        return attendanceService.getRange(s.getId(), from, to);
    }

    @PatchMapping("/student/roll-number")
    @PreAuthorize("hasRole('STUDENT')")
    public MyStudentResponse updateMyRollNumber(@Valid @RequestBody UpdateMyRollNumberRequest req) {
        UUID userId = SecurityUtils.currentUserId();
        var updated = studentService.updateMyRollNumber(userId, req.getRollNumber());
        return new MyStudentResponse(updated.getId(), updated.getRollNumber(), updated.getImageUrl());
    }

    @PostMapping(path = "/student/image", consumes = "multipart/form-data")
    @PreAuthorize("hasRole('STUDENT')")
    public MyStudentResponse uploadMyImage(@RequestPart("file") MultipartFile file) {
        UUID userId = SecurityUtils.currentUserId();
        var updated = studentService.uploadMyImage(userId, file);
        return new MyStudentResponse(updated.getId(), updated.getRollNumber(), updated.getImageUrl());
    }
}
