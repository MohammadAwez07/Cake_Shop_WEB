package com.ammas.pastries.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private Long totalOrders;
    private BigDecimal totalRevenue;
    private Long totalUsers;
    private Long totalProducts;
    private Long pendingOrders;
    private Map<String, Long> ordersByStatus;
    private Map<String, BigDecimal> salesByDate;
}
