package com.smartattendance.config;

import com.smartattendance.entity.Student;
import com.smartattendance.entity.User;
import com.smartattendance.entity.UserRole;
import com.smartattendance.repository.AttendanceRepository;
import com.smartattendance.repository.StudentRepository;
import com.smartattendance.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Dev-only helper: seeds a small dataset for quickly testing APIs via Postman.
 * This runner is OFF by default. Enable with: app.seed.enabled=true
 */
@Component
@ConditionalOnProperty(prefix = "app.seed", name = "enabled", havingValue = "true")
public class DevSeedRunner implements ApplicationRunner {
    private static final Logger log = LoggerFactory.getLogger(DevSeedRunner.class);

    private final AppProperties props;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;
    private final PasswordEncoder passwordEncoder;

    public DevSeedRunner(
            AppProperties props,
            UserRepository userRepository,
            StudentRepository studentRepository,
            AttendanceRepository attendanceRepository,
            PasswordEncoder passwordEncoder) {
        this.props = props;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.attendanceRepository = attendanceRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        log.info("Starting database reset and seed...");

        // 1. Full Database Reset (Order matters for FK constraints)
        // Using deleteAllInBatch() for immediate bulk deletion and to avoid
        // Hibernate's slow one-by-one deletion which can cause flush order issues.
        attendanceRepository.deleteAllInBatch();
        studentRepository.deleteAllInBatch();
        userRepository.deleteAllInBatch();

        // Force flush to ensure the database is empty before we start seeding
        userRepository.flush();
        log.info("Database cleared and flushed.");

        String defaultPassword = props.getSeed().getDefaultPassword();
        if (defaultPassword == null || defaultPassword.length() < 8) {
            throw new IllegalStateException("app.seed.default-password must be at least 8 characters");
        }

        // 2) Seed one admin user
        seedUser(
                "Admin User",
                "admin@school.com",
                defaultPassword,
                UserRole.ADMIN);

        // 3) Seed 10 student users with Student profiles
        for (int i = 1; i <= 10; i++) {
            String idx = String.format("%02d", i);
            User u = seedUser(
                    "Student " + idx,
                    "student" + idx + "@school.com",
                    defaultPassword,
                    UserRole.STUDENT);

            // Every student MUST have a student profile
            seedStudentProfile(u, "ROLL-" + idx);
        }

        log.info("Seed complete. Admin login: admin@school.com / (default password)");
        log.info("Seed complete. 10 students created with profiles.");
    }

    private User seedUser(String name, String email, String rawPassword, UserRole role) {
        User u = new User();
        u.setName(name);
        u.setEmail(email.toLowerCase());
        u.setPassword(passwordEncoder.encode(rawPassword));
        u.setRole(role);
        return userRepository.save(u);
    }

    private void seedStudentProfile(User studentUser, String rollNumber) {
        Student s = new Student();
        s.setUser(studentUser);
        s.setRollNumber(rollNumber);
        studentRepository.save(s);
    }
}
