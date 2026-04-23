package com.smartattendance.dto.attendance;

import com.smartattendance.entity.AttendanceStatus;

import java.time.LocalDate;
import java.util.UUID;

public class AttendanceResponse {
    private UUID id;
    private UUID studentId;
    private LocalDate date;
    private AttendanceStatus status;
    private boolean marked;

    public AttendanceResponse() {
    }

    public AttendanceResponse(UUID id, UUID studentId, LocalDate date, AttendanceStatus status, boolean marked) {
        this.id = id;
        this.studentId = studentId;
        this.date = date;
        this.status = status;
        this.marked = marked;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

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

    public boolean isMarked() {
        return marked;
    }

    public void setMarked(boolean marked) {
        this.marked = marked;
    }
}

