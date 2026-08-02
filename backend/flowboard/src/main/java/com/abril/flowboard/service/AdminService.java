package com.abril.flowboard.service;

import com.abril.flowboard.enums.Role;
import com.abril.flowboard.model.User;
import com.abril.flowboard.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminService {
    private final UserRepository userRepo;

    public AdminService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }
    // Método para actualizar el rol de un usuario
    @Transactional
    public void updateUserRole(Long targetUserId, Role newRole, Authentication auth) {
        User target = userRepo.findById(targetUserId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Evitar que un admin se quite el rol a sí mismo (lockout)
        String currentUsername = auth.getName();
        if (target.getUsername().equals(currentUsername)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No puedes cambiar tu propio rol");
        }

        target.setRole(newRole);
        userRepo.save(target);
        
    }
}