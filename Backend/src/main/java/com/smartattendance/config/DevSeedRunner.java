package com.smartattendance.config;

import com.smartattendance.entity.Student;
import com.smartattendance.entity.User;
import com.smartattendance.entity.UserRole;
import com.smartattendance.repository.StudentRepository;
import com.smartattendance.repository.UserRepository;
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
    private final PasswordEncoder passwordEncoder;

    public DevSeedRunner(
            AppProperties props,
            UserRepository userRepository,
            StudentRepository studentRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.props = props;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        String defaultPassword = props.getSeed().getDefaultPassword();
        if (defaultPassword == null || defaultPassword.length() < 8) {
            throw new IllegalStateException("app.seed.default-password must be at least 8 characters");
        }

        // 1) Seed one admin user (for testing admin-only student APIs)
        seedUserIfMissing(
                "Admin User",
                "admin@school.com",
                defaultPassword,
                UserRole.ADMIN
        );

        // 2) Seed 10 student users. We also create Student profiles for the first 5,
        // so you can test GET /api/students immediately while still being able to test
        // POST /api/students for the remaining users.
        List<User> studentUsers = new ArrayList<>();
        for (int i = 1; i <= 10; i++) {
            String idx = String.format("%02d", i);
            User u = seedUserIfMissing(
                    "Student " + idx,
                    "student" + idx + "@school.com",
                    defaultPassword,
                    UserRole.STUDENT
            );
            studentUsers.add(u);
        }

        for (int i = 1; i <= 5; i++) {
            String idx = String.format("%02d", i);
            User u = studentUsers.get(i - 1);
            seedStudentProfileIfMissing(u, "ROLL-" + idx);
        }

        log.info("Seed complete. Admin login: admin@school.com / (app.seed.default-password)");
        log.info("Seed complete. Student logins: student01@school.com .. student10@school.com / (app.seed.default-password)");
    }

    private User seedUserIfMissing(String name, String email, String rawPassword, UserRole role) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseGet(() -> {
                    User u = new User();
                    u.setName(name);
                    u.setEmail(email.toLowerCase());
                    u.setPassword(passwordEncoder.encode(rawPassword));
                    u.setRole(role);
                    return userRepository.save(u);
                });
    }

    private void seedStudentProfileIfMissing(User studentUser, String rollNumber) {
        studentRepository.findByUser_Id(studentUser.getId())
                .orElseGet(() -> {
                    String roll = rollNumber;
                    if (studentRepository.existsByRollNumberIgnoreCase(roll)) {
                        // If someone already used this roll number, pick a deterministic fallback.
                        String suffix = studentUser.getId().toString().substring(0, 8).toUpperCase();
                        roll = roll + "-" + suffix;
                    }
                    Student s = new Student();
                    s.setUser(studentUser);
                    s.setRollNumber(roll);
                    return studentRepository.save(s);
                });
    }
}
