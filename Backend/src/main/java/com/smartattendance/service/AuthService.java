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
import com.smartattendance.entity.Student;
import com.smartattendance.entity.UserRole;
import com.smartattendance.repository.StudentRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            StudentRepository studentRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
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

        // Auto-create Student profile if role is STUDENT
        if (saved.getRole() == UserRole.STUDENT) {
            Student s = new Student();
            s.setUser(saved);

            String roll = req.getRollNumber();
            if (roll == null || roll.trim().isEmpty()) {
                // Fallback to temporary roll number if not provided
                roll = "TEMP_" + UUID.randomUUID().toString().substring(0, 8);
            } else {
                roll = roll.trim();
                if (studentRepository.existsByRollNumberIgnoreCase(roll)) {
                    throw new ConflictException("Roll number already exists");
                }
            }

            s.setRollNumber(roll);
            studentRepository.save(s);
        }

        String token = jwtService.generateAccessToken(saved);

        UUID studentId = null;
        if (saved.getRole() == UserRole.STUDENT) {
            studentId = studentRepository.findByUser_Id(saved.getId())
                    .map(Student::getId)
                    .orElse(null);
        }

        return new AuthResponse(token, toUserResponse(saved, studentId));
    }

    public AuthResponse login(LoginRequest req) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        } catch (Exception e) {
            throw new UnauthorizedException("Invalid email or password");
        }

        User u = userRepository.findByEmailIgnoreCase(req.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));
        String token = jwtService.generateAccessToken(u);

        UUID studentId = null;
        if (u.getRole() == UserRole.STUDENT) {
            studentId = studentRepository.findByUser_Id(u.getId())
                    .map(Student::getId)
                    .orElse(null);
        }

        return new AuthResponse(token, toUserResponse(u, studentId));
    }

    private static UserResponse toUserResponse(User u, UUID studentId) {
        return new UserResponse(u.getId(), u.getName(), u.getEmail(), u.getRole(), studentId);
    }
}
