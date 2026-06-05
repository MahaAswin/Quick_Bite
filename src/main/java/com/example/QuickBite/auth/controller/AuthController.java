package com.example.QuickBite.auth.controller;

import com.example.QuickBite.auth.dto.RegisterRequest;
import com.example.QuickBite.auth.dto.loginRequest;
import com.example.QuickBite.auth.service.AuthService;
import com.example.QuickBite.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody RegisterRequest request){

        return ResponseEntity.ok(
                authService.register(request)
        );
    }

    @PostMapping("/login")
    public String login(
            @RequestBody loginRequest request){

        return authService.login(request);
    }

    @PostMapping("test")
    public String test(){
        String token= jwtService.generateToken("maha@gmail.com");
        System.out.println(token);
        Boolean valid= jwtService.isTokenValid(token,"maha@gmail.com");
        return String.valueOf(valid);
    }
}
