// src/test/java/com/abril/flowboard/service/ProcessServiceTest.java
package com.abril.flowboard.service;

import com.abril.flowboard.enums.ProcessStatus;
import com.abril.flowboard.enums.StateTransitionRules;
import com.abril.flowboard.model.Process;
import com.abril.flowboard.model.User;
import com.abril.flowboard.repository.ProcessRepository;
import com.abril.flowboard.repository.ProcessAuditRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils; 
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

// Test unitario para ProcessService
// Verifica que se lance una excepción al intentar hacer una transición de estado no permitida

@ExtendWith(MockitoExtension.class)
class ProcessServiceTest {

    @Mock private ProcessRepository processRepo;
    @Mock private ProcessAuditRepository auditRepo;
    @InjectMocks private ProcessService processService;

    @Test
    void updateStatus_shouldThrowException_WhenInvalidTransition() {
        // ARRANGE 
        // Crea un proceso de prueba en estado CREADO
        Process process = new Process();
        ReflectionTestUtils.setField(process, "id", 1L);
        ReflectionTestUtils.setField(process, "status", ProcessStatus.CREADO);

        // Simula que el repositorio devuelve este proceso cuando se busca por ID
        when(processRepo.findById(1L)).thenReturn(Optional.of(process));

        // Crea un usuario de prueba que realizará la acción
        User fakeUser = new User();
        ReflectionTestUtils.setField(fakeUser, "id", 99L);
        ReflectionTestUtils.setField(fakeUser, "username", "test_user");

        // Simular el comportamiento de la clase estática StateTransitionRules usando MockedStatic
        try (MockedStatic<StateTransitionRules> mocked = mockStatic(StateTransitionRules.class)) {
            mocked.when(() -> StateTransitionRules.isValidTransition(ProcessStatus.CREADO, ProcessStatus.APROBADO))
                  .thenReturn(false);

            // === ACT & ASSERT ===
            // Verifica que se lance una excepción al intentar hacer una transición no permitida
            RuntimeException exception = assertThrows(RuntimeException.class, () -> 
                processService.updateStatus(1L, ProcessStatus.APROBADO, fakeUser, "Test comment")
            );

            // Verifica el mensaje de error
            assertTrue(exception.getMessage().contains("Transición no permitida"));
            assertTrue(exception.getMessage().contains("CREADO"));
            assertTrue(exception.getMessage().contains("APROBADO"));

            // Verificamos que NUNCA se intentó guardar el proceso (rollback implícito)
            verify(processRepo, never()).save(any());
            verify(auditRepo, never()).save(any());
        }
    }
}