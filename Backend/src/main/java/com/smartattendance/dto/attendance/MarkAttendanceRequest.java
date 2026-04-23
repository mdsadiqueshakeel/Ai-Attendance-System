package com.smartattendance.dto.attendance;

import com.smartattendance.entity.AttendanceStatus;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public class MarkAttendanceRequest {
    @NotNull
    private UUID studentId;

    @NotNull
    private LocalDate date;

    @NotNull
    private AttendanceStatus status;

    public UUID getStudentId() {
        return studentId;
    }

    public void setStudentId(UUID studentId) {
        this.studentId = studentId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public AttendanceStatus getStatus() {
        return status;
    }

    public void setStatus(AttendanceStatus status) {
        this.status = status;
    }
}

