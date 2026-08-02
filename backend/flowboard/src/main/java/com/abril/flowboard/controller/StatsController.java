package com.abril.flowboard.controller;

import com.abril.flowboard.dto.MonthlyProcessStatsResponse;
import com.abril.flowboard.service.StatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Controlador para manejar las estadísticas de procesos.
@RestController
@RequestMapping("/api/stats")
public class StatsController {
    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }
// Función para obtener las estadísticas mensuales de procesos.
    @GetMapping("/processes/monthly")
    public ResponseEntity<MonthlyProcessStatsResponse> getMonthlyProcesses() {
        var monthCounts = statsService.getMonthlyProcessCounts();
        return ResponseEntity.ok(MonthlyProcessStatsResponse.from(monthCounts));
    }
}
