package com.smartattendance.service;

import com.smartattendance.dto.auth.AuthResponse;
import com.smartattendance.dto.auth.LoginRequest;
import com.smartattendance.dto.auth.RegisterRequest;
import com.smartattendance.dto.auth.UserResponse;
import com.smartattendance.entity.User;
import com.smartattendance.exception.ConflictException;
import com.smartattendance.exception.UnauthorizedException;
import com.smartattendance.repository.UserRepository;
import com.smartattendance.security.JwtService;
import jakarta.transaction.Transactional;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmailIgnoreCase(req.getEmail())) {
            throw new ConflictException("Email already registered");
        }

        User u = new User();
        u.setName(req.getName().trim());
        u.setEmail(req.getEmail().trim().toLowerCase());
        u.setPassword(passwordEncoder.encode(req.getPassword()));
        u.setRole(req.getRole());

        User saved = userRepository.save(u);
        String token = jwtService.generateAccessToken(saved);
        return new AuthResponse(token, toUserResponse(saved));
    }

    public AuthResponse login(LoginRequest req) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
            );
        } catch (Exception e) {
            throw new UnauthorizedException("Invalid email or password");
        }

        User u = userRepository.findByEmailIgnoreCase(req.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));
        String token = jwtService.generateAccessToken(u);
        return new AuthResponse(token, toUserResponse(u));
    }

    private static UserResponse toUserResponse(User u) {
        return new UserResponse(u.getId(), u.getName(), u.getEmail(), u.getRole());
    }
}

