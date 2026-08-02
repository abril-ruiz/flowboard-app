package com.abril.flowboard.service;

import com.abril.flowboard.repository.ProcessRepository;
import org.springframework.stereotype.Service;
import java.util.LinkedHashMap;
import java.util.Map;
// Servicio para obtener estadísticas de procesos
@Service
public class StatsService {
    private final ProcessRepository processRepo;

    public StatsService(ProcessRepository processRepo) {
        this.processRepo = processRepo;
    }

    public Map<String, Integer> getMonthlyProcessCounts() {
        var processes = processRepo.findAll();
        var monthCounts = new LinkedHashMap<String, Integer>();
        
        // Inicializar 12 meses con 0
        String[] months = {"Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                          "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"};
        for (String month : months) {
            monthCounts.put(month, 0);
        }
        
        // Contar procesos por mes (del año actual)
        int currentYear = java.time.LocalDate.now().getYear();
        for (var process : processes) {
            if (process.getCreatedAt() != null) {
                int year = process.getCreatedAt().getYear();
                if (year == currentYear) {
                    int month = process.getCreatedAt().getMonthValue() - 1; // 0-indexed
                    if (month >= 0 && month < 12) {
                        String monthName = months[month];
                        monthCounts.put(monthName, monthCounts.get(monthName) + 1);
                    }
                }
            }
        }
        
        return monthCounts;
    }
}
