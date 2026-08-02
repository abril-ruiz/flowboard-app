package com.abril.flowboard.service;
import com.abril.flowboard.model.User;
import com.abril.flowboard.repository.UserRepository;
import com.abril.flowboard.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepo;
    private final JwtTokenProvider tokenProvider;
    private final HttpServletRequest request;

    public UserService(UserRepository userRepo, JwtTokenProvider tokenProvider, HttpServletRequest request) {
        this.userRepo = userRepo;
        this.tokenProvider = tokenProvider;
        this.request = request;
    }
    // Obtiene el usuario actualmente autenticado a partir del token JWT en el header "Authorization"
    public User getCurrentUser(){
        String authHeader = request.getHeader("Authorization");
        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            throw new RuntimeException("Token no proporcionado");
        }
        String token = authHeader.substring(7);
        String username = tokenProvider.getUsername(token);

        return userRepo.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}
