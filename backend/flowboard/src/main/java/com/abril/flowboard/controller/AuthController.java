package com.abril.flowboard.controller;
import com.abril.flowboard.dto.*;
import com.abril.flowboard.service.AuthService;
import com.abril.flowboard.service.UserService;
import com.abril.flowboard.dto.AuthResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

/*
  Maneja registro de nuevos usuarios y login/autenticación.
  Retorna JWT tokens para acceder a endpoints protegidos
 */

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    // Registra un nuevo usuario en el sistema
    @PostMapping("/register")
    @Operation(summary = "Registrar nuevo usuario")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Registro exitoso"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos"),
        @ApiResponse(responseCode = "409", description = "Username o email ya existe")
    })
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }

    // Autentica un usuario existente
    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Login exitoso"),
        @ApiResponse(responseCode = "400", description = "Credenciales inválidas")
    })
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    // Devuelve la información del usuario autenticado a partir del token en el header
    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me() {
        try {
            var user = userService.getCurrentUser();
            return ResponseEntity.ok(new AuthResponse(null, user.getRole().name(), user.getUsername(), user.getEmail()));
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token inválido o usuario no encontrado");
        }
    }

}
