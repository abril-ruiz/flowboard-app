package com.abril.flowboard.service;

import com.abril.flowboard.model.Process;
import com.abril.flowboard.repository.ProcessRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

// Test unitario para StatsService, usando Mockito para simular dependencias
// Verifica que el método getMonthlyProcessCounts() funcione correctamente

@ExtendWith(MockitoExtension.class)
class StatsServiceTest {

    // Crea un "REPOSITORIO FALSO" 
    @Mock
    private ProcessRepository processRepository;

    // Inyecta el repositorio falso en el servicio que se va a probar
    @InjectMocks
    private StatsService statsService;

    @Test
    void getMonthlyProcessCounts_shouldReturnCorrectData() {
        // ARRANGE (Preparar)
        Process p1 = new Process();
        ReflectionTestUtils.setField(p1, "createdAt", LocalDateTime.of(2026, 7, 15, 10, 0));

        Process p2 = new Process();
        ReflectionTestUtils.setField(p2, "createdAt", LocalDateTime.of(2026, 7, 20, 14, 30));

        Process p3 = new Process();
        ReflectionTestUtils.setField(p3, "createdAt", LocalDateTime.of(2026, 8, 5, 9, 0));

        // El repositorio falso devolverá estos procesos cuando se llame a findAll()
        when(processRepository.findAll()).thenReturn(List.of(p1, p2, p3));

        // ACT (Actuar) 
        Map<String, Integer> result = statsService.getMonthlyProcessCounts();

        // ASSERT (Verificar)
        // Verifica que Julio tenga 2 procesos y Agosto 1
        assertEquals(2, result.get("Julio"));
        assertEquals(1, result.get("Agosto"));
        assertEquals(0, result.get("Enero")); // El resto debe estar en 0

        // Verifica que SÍ se llamó al repositorio (y solo 1 vez)
        verify(processRepository, times(1)).findAll();
    }
}