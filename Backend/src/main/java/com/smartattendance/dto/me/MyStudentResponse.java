package com.smartattendance.dto.me;

import java.util.UUID;

public class MyStudentResponse {
    private UUID studentId;
    private String rollNumber;
    private String imageUrl;

    public MyStudentResponse() {
    }

    public MyStudentResponse(UUID studentId, String rollNumber, String imageUrl) {
        this.studentId = studentId;
        this.rollNumber = rollNumber;
        this.imageUrl = imageUrl;
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}

