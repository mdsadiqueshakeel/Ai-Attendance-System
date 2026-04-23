package com.smartattendance.controller;

import com.smartattendance.dto.student.CreateStudentRequest;
import com.smartattendance.dto.student.StudentResponse;
import com.smartattendance.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/students")
public class StudentController {
    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public StudentResponse create(@Valid @org.springframework.web.bind.annotation.RequestBody CreateStudentRequest req) {
        return studentService.create(req);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<StudentResponse> listAll() {
        return studentService.listAll();
    }

    @PostMapping(path = "/{studentId}/image", consumes = "multipart/form-data")
    @PreAuthorize("hasRole('ADMIN')")
    public StudentResponse uploadImage(
            @PathVariable UUID studentId,
            @RequestPart("file") MultipartFile file
    ) {
        return studentService.uploadImage(studentId, file);
    }
}

