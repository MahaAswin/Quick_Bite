package com.example.QuickBite.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminDashboardResponse {

    private long totalUsers;
    private long totalAdmin;
    private long totalAccount;
    private long totalOrder;
    private long pendingOrder;
    private long completedOrder;

}
