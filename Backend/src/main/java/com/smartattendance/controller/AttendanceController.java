package com.smartattendance.controller;

import com.smartattendance.dto.attendance.AttendanceResponse;
import com.smartattendance.dto.attendance.AutoAttendanceResponse;
import com.smartattendance.dto.attendance.ClassReportResponse;
import com.smartattendance.dto.attendance.MarkAttendanceRequest;
import com.smartattendance.service.AttendanceService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
            @RequestParam("date") @NotNull @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return attendanceService.getByStudentAndDate(studentId, date);
    }

    @GetMapping("/report")
    @PreAuthorize("hasRole('ADMIN')")
    public ClassReportResponse report(
            @RequestParam("date") @NotNull @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return attendanceService.classReport(date);
    }

    @PostMapping(value = "/auto", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> autoAttendance(@RequestPart("file") MultipartFile file) {
        System.out.println("DEBUG: Entering autoAttendance endpoint");
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is missing or empty");
        }

        System.out.println("File received: " + file.getOriginalFilename() + " (" + file.getSize() + " bytes)");
        AutoAttendanceResponse response = attendanceService.autoAttendance(file);
        return ResponseEntity.ok(response);
    }
}
