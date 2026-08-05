package com.abril.flowboard.service;

import com.abril.flowboard.enums.Role;
import com.abril.flowboard.model.User;
import com.abril.flowboard.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.server.ResponseStatusException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

// Test unitario para AdminService
// Verifica que un administrador no pueda cambiar su propio rol, y que se lance la excepción correcta

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock private UserRepository userRepo;
    @Mock private Authentication auth;
    @InjectMocks private AdminService adminService;

    @Test
    void updateUserRole_shouldThrowException_WhenAdminTriesToChangeOwnRole() {
        // Arrange
        User admin = new User();
        admin.setUsername("admin_test");
        
        when(userRepo.findById(1L)).thenReturn(Optional.of(admin));
        when(auth.getName()).thenReturn("admin_test"); // Mismo usuario

        // Act & Assert
        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class,
            () -> adminService.updateUserRole(1L, Role.USER, auth)
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertTrue(exception.getReason().contains("propio rol"));
        
        // Verifica que NUNCA se intentó guardar (rollback implícito)
        verify(userRepo, never()).save(any());
    }
} 
