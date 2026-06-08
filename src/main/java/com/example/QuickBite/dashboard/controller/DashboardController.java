package com.example.QuickBite.dashboard.controller;
import com.example.QuickBite.dashboard.dto.AdminDashboardResponse;
import com.example.QuickBite.dashboard.dto.ProfileResponse;
import com.example.QuickBite.dashboard.dto.UserDashboardResponse;
import com.example.QuickBite.dashboard.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/user/profile")
    public ProfileResponse getProfile(){
        return dashboardService.getProfile();
    }

    @GetMapping("/admin/dashboard")
    public AdminDashboardResponse getAdminDashboard() {
        return dashboardService.getAdminDashboard();
    }

    @GetMapping("user/dashboard")
    public UserDashboardResponse getUserDashboard(){
        return dashboardService.getUserDashboard();
    }
}
