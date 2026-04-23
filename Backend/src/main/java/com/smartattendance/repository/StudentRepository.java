package com.smartattendance.repository;

import com.smartattendance.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, UUID> {
    boolean existsByRollNumberIgnoreCase(String rollNumber);
    Optional<Student> findByUser_Id(UUID userId);

    @Override
    @EntityGraph(attributePaths = {"user"})
    List<Student> findAll();
}
