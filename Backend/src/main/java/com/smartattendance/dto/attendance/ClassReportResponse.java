package com.smartattendance.dto.attendance;

import java.time.LocalDate;
import java.util.List;

public class ClassReportResponse {
    private LocalDate date;
    private int totalStudents;
    private int presentCount;
    private int absentCount;
    private List<StudentAttendanceEntry> entries;

    public ClassReportResponse() {
    }

    public ClassReportResponse(LocalDate date, int totalStudents, int presentCount, int absentCount, List<StudentAttendanceEntry> entries) {
        this.date = date;
        this.totalStudents = totalStudents;
        this.presentCount = presentCount;
        this.absentCount = absentCount;
        this.entries = entries;
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

    public int getPresentCount() {
        return presentCount;
    }

    public void setPresentCount(int presentCount) {
        this.presentCount = presentCount;
    }

    public int getAbsentCount() {
        return absentCount;
    }

    public void setAbsentCount(int absentCount) {
        this.absentCount = absentCount;
    }

    public List<StudentAttendanceEntry> getEntries() {
        return entries;
    }

    public void setEntries(List<StudentAttendanceEntry> entries) {
        this.entries = entries;
    }
}

