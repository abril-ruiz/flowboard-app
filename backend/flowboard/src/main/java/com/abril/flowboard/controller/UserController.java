package com.abril.flowboard.controller;

import com.abril.flowboard.dto.ChangePasswordRequest;
import com.abril.flowboard.dto.ProfileUpdateRequest;
import com.abril.flowboard.model.User;
import com.abril.flowboard.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.Map;

// Controlador para manejar las operaciones relacionadas con el usuario.
@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }
// Función para actualizar el perfil del usuario actual.
    @PutMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(@Valid @RequestBody ProfileUpdateRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        if (!user.getUsername().equals(request.username()) && userRepo.existsByUsername(request.username())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El nombre de usuario ya está en uso");
        }

        if (!user.getEmail().equals(request.email()) && userRepo.findByEmail(request.email()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El email ya está en uso");
        }

        user.setUsername(request.username());
        user.setEmail(request.email());
        userRepo.save(user);

        return ResponseEntity.ok(Map.of(
                "message", "Perfil actualizado correctamente",
                "username", user.getUsername(),
                "email", user.getEmail()
        ));
    }

    @PutMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        // Validación 1: Verificar contraseña actual
        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña actual es incorrecta");
        }

        // Validación 2: Verificar que las nuevas contraseñas coincidan
        if (!request.newPassword().equals(request.confirmNewPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Las nuevas contraseñas no coinciden");
        }

        // Validación 3: Verificar que no sea igual a la actual
        if (passwordEncoder.matches(request.newPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                "La nueva contraseña debe ser diferente a la actual");
        }

        // Validación 4: Validar requisitos NIST (longitud + complejidad)
        String errorMsg = validatePasswordStrength(request.newPassword(), user.getUsername(), user.getEmail());
        if (errorMsg != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, errorMsg);
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepo.save(user);

        return ResponseEntity.ok(Map.of("message", "Contraseña cambiada correctamente"));
    }

    /**
     * Valida la fortaleza de una contraseña según estándares NIST.
     * Requisitos:
     * - Mínimo 12 caracteres
     * - Al menos 3 de 4 tipos: mayúscula, minúscula, número, carácter especial
     * - No contiene username ni email
     * 
     * retorna null si es válida, mensaje de error si no lo es
     */
    private String validatePasswordStrength(String password, String username, String email) {
        // Validación 1: Longitud mínima
        if (password.length() < 12) {
            return "La contraseña debe tener al menos 12 caracteres";
        }

        // Validación 2: No contiene username ni email
        if (password.toLowerCase().contains(username.toLowerCase())) {
            return "La contraseña no debe contener el nombre de usuario";
        }
        if (password.toLowerCase().contains(email.split("@")[0].toLowerCase())) {
            return "La contraseña no debe contener datos del email";
        }

        // Validación 3: Verificar complejidad (al menos 3 de 4)
        int typeCount = 0;
        
        // Verificar mayúscula
        if (password.matches(".*[A-Z].*")) {
            typeCount++;
        }
        
        // Verificar minúscula
        if (password.matches(".*[a-z].*")) {
            typeCount++;
        }
        
        // Verificar número
        if (password.matches(".*[0-9].*")) {
            typeCount++;
        }
        
        // Verificar carácter especial (@, #, $, %, *, !, &, etc.)
        if (password.matches(".*[@#$%^&+=*!._\\-].*")) {
            typeCount++;
        }

        if (typeCount < 3) {
            return "La contraseña debe incluir al menos 3 de: mayúsculas, minúsculas, números y caracteres especiales";
        }

        return null;
    }
}
