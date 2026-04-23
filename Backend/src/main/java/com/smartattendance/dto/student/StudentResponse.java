package com.smartattendance.dto.student;

import java.util.UUID;

public class StudentResponse {
    private UUID id;
    private UUID userId;
    private String name;
    private String email;
    private String rollNumber;
    private String imageUrl;

    public StudentResponse() {
    }

    public StudentResponse(UUID id, UUID userId, String name, String email, String rollNumber, String imageUrl) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.rollNumber = rollNumber;
        this.imageUrl = imageUrl;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

