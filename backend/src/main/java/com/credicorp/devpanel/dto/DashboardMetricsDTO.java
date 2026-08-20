package com.credicorp.devpanel.dto;

public record DashboardMetricsDTO(
        long totalUsers,
        long activeUsers,
        long inactiveUsers,
        long adminUsers
) {
}
