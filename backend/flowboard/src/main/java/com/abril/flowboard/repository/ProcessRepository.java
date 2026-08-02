package com.abril.flowboard.repository;
import com.abril.flowboard.model.Process;
import com.abril.flowboard.enums.ProcessStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Map;

// Repositorio principal para procesos y consultas de filtrado
public interface ProcessRepository extends JpaRepository<Process, Long> {
    // Busca procesos creados por un usuario específico
    List<Process> findByCreatedById(Long userId);
    // Busca procesos por su estado actual
    List<Process> findByStatus(ProcessStatus status);
    // Busca procesos que tengan una etiqueta específica (por ID)
    @Query("SELECT DISTINCT p FROM Process p " +
        "LEFT JOIN p.tags t " +
        "WHERE (:status IS NULL OR p.status = :status) " +
        "AND (:userId IS NULL OR p.createdBy.id = :userId) " +
        "AND (:tagId IS NULL OR t.id = :tagId)")
    List<Process> findByFilters(@Param("status") ProcessStatus status,
                                @Param("userId") Long userId,
                                @Param("tagId") Long tagId);

    // Busca procesos que tengan una etiqueta específica (case-insensitive)
    @Query("SELECT DISTINCT p FROM Process p " +
       "JOIN p.tags t " +
       "WHERE LOWER(t.name) = LOWER(:tagName)")
    List<Process> findByTagName(@Param("tagName") String tagName);

    @Query("SELECT new map(p.status as status, COUNT(p) as count) FROM Process p GROUP BY p.status")
    // Cuenta procesos agrupándolos por estado para estadísticas de panel
    List<Map<String, Object>> countByStatus();
} 