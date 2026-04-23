package com.smartattendance.repository;

import com.smartattendance.entity.Attendance;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AttendanceRepository extends JpaRepository<Attendance, UUID> {
    Optional<Attendance> findByStudent_IdAndDate(UUID studentId, LocalDate date);

    @EntityGraph(attributePaths = {"student", "student.user"})
    List<Attendance> findByDate(LocalDate date);
}

