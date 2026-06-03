package com.example.QuickBite.user.entity;

import com.example.QuickBite.enums.Roles.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="user")
@Builder
public class User {

    @Id
    @GeneratedValue
    private Long id;
    @NotBlank
    private String name;
    @Email
    private String email;
    @Size(max = 8)
    private String password;
    @Size(max=10)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    private Role role;
    private LocalDateTime createdAt;

}
