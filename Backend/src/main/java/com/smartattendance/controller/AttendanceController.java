package com.smartattendance.controller;

import com.smartattendance.dto.attendance.AttendanceResponse;
import com.smartattendance.dto.attendance.ClassReportResponse;
import com.smartattendance.dto.attendance.MarkAttendanceRequest;
import com.smartattendance.service.AttendanceService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {
    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/mark")
    @PreAuthorize("hasRole('ADMIN')")
    public AttendanceResponse mark(@Valid @RequestBody MarkAttendanceRequest req) {
        return attendanceService.mark(req);
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public AttendanceResponse getForStudent(
            @PathVariable UUID studentId,
            @RequestParam("date") @NotNull @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return attendanceService.getByStudentAndDate(studentId, date);
    }

    @GetMapping("/report")
    @PreAuthorize("hasRole('ADMIN')")
    public ClassReportResponse report(
            @RequestParam("date") @NotNull @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return attendanceService.classReport(date);
    }
}

