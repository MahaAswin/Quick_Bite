package com.example.QuickBite.dashboard.service;

import com.example.QuickBite.dashboard.dto.AdminDashboardResponse;
import com.example.QuickBite.dashboard.dto.ProfileResponse;
import com.example.QuickBite.dashboard.dto.UserDashboardResponse;

public interface DashboardService {

    ProfileResponse getProfile();
    AdminDashboardResponse getAdminDashboard();
    UserDashboardResponse getUserDashboard();
}
