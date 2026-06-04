package com.example.QuickBite.auth.service;

import com.example.QuickBite.auth.dto.RegisterRequest;
import com.example.QuickBite.auth.dto.loginRequest;


public interface AuthService {

    public String register(RegisterRequest request);

    public String login(loginRequest request);
}
