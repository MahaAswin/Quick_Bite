package com.example.QuickBite.auth.service;

import com.example.QuickBite.auth.dto.RegisterRequest;
import com.example.QuickBite.auth.dto.loginRequest;
import com.example.QuickBite.auth.dto.loginResponse;


public interface AuthService {

    public String register(RegisterRequest request);

    public loginResponse login(loginRequest request);
}
