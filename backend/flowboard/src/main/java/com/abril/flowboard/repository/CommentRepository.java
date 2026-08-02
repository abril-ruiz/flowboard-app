package com.abril.flowboard.repository;
import com.abril.flowboard.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

// Repositorio para comentarios, conectado a la entidad Comment
public interface CommentRepository extends JpaRepository<Comment, Long> {
    // Devuelve los comentarios de un proceso ordenados por fecha de creación ascendente
    List<Comment> findByProcessIdOrderByCreatedAtAsc(Long processId);
    
}
