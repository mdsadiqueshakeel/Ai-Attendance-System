package com.smartattendance.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.UUID;

public class JwtPrincipal {
    private final UUID userId;
    private final String email;
    private final String role; // "ADMIN" / "STUDENT"

    public JwtPrincipal(String userId, String email, String role) {
        this.userId = UUID.fromString(userId);
        this.email = email;
        this.role = role;
    }

    public UUID getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public GrantedAuthority asAuthority() {
        return new SimpleGrantedAuthority("ROLE_" + role);
    }
}

