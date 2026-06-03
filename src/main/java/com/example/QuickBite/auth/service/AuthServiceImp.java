package com.example.QuickBite.auth.service;

import com.example.QuickBite.auth.dto.loginRequest;
import com.example.QuickBite.auth.dto.RegisterRequest;
import com.example.QuickBite.enums.Roles;
import com.example.QuickBite.user.entity.User;
import com.example.QuickBite.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.management.relation.Role;

@Service
@RequiredArgsConstructor
public class AuthServiceImp implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public String register(RegisterRequest request) {

        if(userRepository.existsByEmail(request.getEmail())){
            return "User already exists";
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phoneNo(request.getPhoneNo())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Roles.USER)
                .build();

        userRepository.save(user);

        return "User Registered Successfully";
    }

    @Override
    public String login(loginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User Not Found"));

        if(!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())){

            throw new RuntimeException("Invalid Password");
        }

        return "Login Successful";
    }
}
