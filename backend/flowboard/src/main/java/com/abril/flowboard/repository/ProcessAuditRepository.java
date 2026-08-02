package com.abril.flowboard.repository;
import com.abril.flowboard.model.ProcessAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

// Repositorio para el historial de auditoría de procesos
public interface ProcessAuditRepository extends JpaRepository<ProcessAudit, Long> {
    // Recupera entradas de auditoría de un proceso, las más recientes primero
    List<ProcessAudit> findByProcessIdOrderByChangedAtDesc(Long processId);
}
