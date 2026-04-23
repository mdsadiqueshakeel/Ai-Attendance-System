package com.smartattendance.dto.attendance;

import com.smartattendance.entity.AttendanceStatus;

import java.util.UUID;

public class StudentAttendanceEntry {
    private UUID attendanceId;
    private UUID studentId;
    private String rollNumber;
    private String name;
    private AttendanceStatus status;
    private boolean marked;

    public StudentAttendanceEntry() {
    }

    public StudentAttendanceEntry(UUID attendanceId, UUID studentId, String rollNumber, String name, AttendanceStatus status, boolean marked) {
        this.attendanceId = attendanceId;
        this.studentId = studentId;
        this.rollNumber = rollNumber;
        this.name = name;
        this.status = status;
        this.marked = marked;
    }

    public UUID getAttendanceId() {
        return attendanceId;
    }

    public void setAttendanceId(UUID attendanceId) {
        this.attendanceId = attendanceId;
    }

    public UUID getStudentId() {
        return studentId;
    }

    public void setStudentId(UUID studentId) {
        this.studentId = studentId;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

