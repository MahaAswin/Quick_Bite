package com.example.QuickBite.dashboard.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DashboardController {

    @GetMapping("user/dashboard")
    public String userDashboard(){
        return "User Dashboard";
    }

    @GetMapping("admin/dashboard")
    public String adminDashboard(){
        return "admin Dashboard";
    }
}
