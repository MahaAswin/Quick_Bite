package com.example.QuickBite.dashboard.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class UpdateProfileRequest {

    @NotBlank(message = "User name should not be empty")
    private String name;

    @Pattern(
            regexp = "^[0-9]{10}$",
            message = "Phone number must be 10 digits"
    )
    private String phoneNo;
}
