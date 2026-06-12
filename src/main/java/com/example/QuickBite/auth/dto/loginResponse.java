package com.example.QuickBite.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class loginResponse {

    private String token;
    private String role;
}