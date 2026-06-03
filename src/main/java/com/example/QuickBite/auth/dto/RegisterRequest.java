package com.example.QuickBite.auth.dto;

import lombok.Data;

@Data
public class RegisterRequest {

    private String name;
    private String phoneNo;
    private String email;
    private String password;

}
