package com.abril.flowboard.repository;
import com.abril.flowboard.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

// Repositorio para etiquetas utilizadas en procesos
public interface TagRepository extends JpaRepository<Tag, Long> {
    // Busca una etiqueta por su nombre único
    Optional<Tag> findByName(String name);
}
