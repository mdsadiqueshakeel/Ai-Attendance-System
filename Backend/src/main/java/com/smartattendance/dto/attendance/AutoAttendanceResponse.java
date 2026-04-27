package com.smartattendance.dto.attendance;

import java.time.LocalDate;
import java.util.List;

public class AutoAttendanceResponse {
    private LocalDate date;
    private int totalStudents;
    private int present;
    private int absent;
    private List<StudentAttendanceEntry> details;

    public AutoAttendanceResponse() {}

    public AutoAttendanceResponse(LocalDate date, int totalStudents, int present, int absent, List<StudentAttendanceEntry> details) {
        this.date = date;
        this.totalStudents = totalStudents;
        this.present = present;
        this.absent = absent;
        this.details = details;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public int getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(int totalStudents) {
        this.totalStudents = totalStudents;
    }

    public int getPresent() {
        return present;
    }

    public void setPresent(int present) {
        this.present = present;
    }

    public int getAbsent() {
        return absent;
    }

    public void setAbsent(int absent) {
        this.absent = absent;
    }

    public List<StudentAttendanceEntry> getDetails() {
        return details;
    }

    public void setDetails(List<StudentAttendanceEntry> details) {
        this.details = details;
    }
}
