package com.smartattendance.dto.me;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateMeRequest {
    @NotBlank
    @Size(min = 2, max = 100)
    private String name;

    @NotBlank
    @Email
    @Size(max = 100)
    private String email;
}
