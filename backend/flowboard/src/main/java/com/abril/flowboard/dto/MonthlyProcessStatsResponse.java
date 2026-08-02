package com.abril.flowboard.dto;

import java.util.List;

public record MonthlyProcessStatsResponse(List<MonthData> data) {
    public record MonthData(String month, int count) {}
    
    public static MonthlyProcessStatsResponse from(java.util.Map<String, Integer> monthCounts) {
        var data = monthCounts.entrySet().stream()
            .map(e -> new MonthData(e.getKey(), e.getValue()))
            .toList();
        return new MonthlyProcessStatsResponse(data);
    }
}
