package com.smartattendance.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.UUID;

public final class SecurityUtils {
    private SecurityUtils() {
    }

    public static JwtPrincipal requirePrincipal() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            throw new IllegalStateException("No authenticated principal");
        }
        Object p = auth.getPrincipal();
        if (p instanceof JwtPrincipal jp) {
            return jp;
        }
        // For any other principal type, fail fast so we notice during development.
        throw new IllegalStateException("Unsupported principal type: " + p.getClass().getName());
    }

    public static UUID currentUserId() {
        return requirePrincipal().getUserId();
    }
}

