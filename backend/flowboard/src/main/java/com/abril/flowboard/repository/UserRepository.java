package com.abril.flowboard.repository;
import com.abril.flowboard.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

// Repositorio para usuarios con consultas de autenticación
public interface UserRepository extends JpaRepository<User, Long> {
    // Busca un usuario por nombre de usuario
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    // Verifica si ya existe un nombre de usuario registrado
    boolean existsByUsername(String username);
}