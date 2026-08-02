package com.abril.flowboard.controller;

import com.abril.flowboard.enums.Role;
import com.abril.flowboard.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')") // Solo admins pueden acceder
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }
    // Endpoint para actualizar el rol de un usuario
    @Operation(summary = "Actualizar rol de un usuario (admin)")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Rol actualizado"),
        @ApiResponse(responseCode = "400", description = "No puedes cambiar tu propio rol"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id,
                                            @RequestParam Role newRole,
                                            Authentication auth) {
        adminService.updateUserRole(id, newRole, auth);
        return ResponseEntity.ok("Rol actualizado a " + newRole);
    }
}