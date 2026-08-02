package com.abril.flowboard.service;
import com.abril.flowboard.dto.*;
import com.abril.flowboard.enums.Role;
import com.abril.flowboard.model.User;
import com.abril.flowboard.repository.UserRepository;
import com.abril.flowboard.security.JwtTokenProvider;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

// Servicio de autenticación: maneja registro y login de usuarios con generación de tokens JWT
@Service
public class AuthService {
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authManager;

    public AuthService(UserRepository userRepo, PasswordEncoder encoder, JwtTokenProvider tokenProvider, AuthenticationManager authManager) {
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.tokenProvider = tokenProvider;
        this.authManager = authManager;
    }

    // Crea un nuevo usuario con contraseña encriptada y genera token JWT para acceso inmediato
    public AuthResponse register(RegisterRequest req) {
        if (userRepo.existsByUsername(req.username())) {
        throw new ResponseStatusException(
            HttpStatus.CONFLICT, 
            "El username '" + req.username() + "' ya está registrado"
        );
    }
        User user = new User();
        user.setUsername(req.username());
        user.setEmail(req.email());
        user.setPassword(encoder.encode(req.password()));
        user.setRole(Role.USER);
        userRepo.save(user);
        String token = tokenProvider.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResponse(token, user.getRole().name(), user.getUsername(), user.getEmail());
    }

    // Autentica el usuario y retorna token JWT si las credenciales son válidas
    public AuthResponse login(AuthRequest req) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.username(), req.password()));
        User user = userRepo.findByUsername(req.username()).orElseThrow();
        String token = tokenProvider.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResponse(token, user.getRole().name(), user.getUsername(), user.getEmail());
    }
}