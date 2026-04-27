package com.smartattendance.dto.auth;

import com.smartattendance.entity.UserRole;

import java.util.UUID;

public class UserResponse {
    private UUID id;
    private String name;
    private String email;
    private UserRole role;
    private UUID studentId;

    public UserResponse() {
    }

    public UserResponse(UUID id, String name, String email, UserRole role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public UserResponse(UUID id, String name, String email, UserRole role, UUID studentId) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.studentId = studentId;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public UUID getStudentId() {
        return studentId;
    }

    public void setStudentId(UUID studentId) {
        this.studentId = studentId;
    }
}
