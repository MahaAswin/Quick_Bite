package com.example.QuickBite.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDashboardResponse {

    private String name;
    private String email;
    private String phoneNo;

    private long totalOrders;
    private long pendingOrders;
    private long completedOrders;
}
