package com.abril.flowboard.service;
import com.abril.flowboard.enums.ProcessStatus;
import com.abril.flowboard.enums.StateTransitionRules;
import com.abril.flowboard.model.Process;
import com.abril.flowboard.model.ProcessAudit;
import com.abril.flowboard.model.User;
import com.abril.flowboard.repository.ProcessAuditRepository;
import com.abril.flowboard.repository.ProcessRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Comparator;
import java.util.List;

// Servicio de procesos: crea procesos, gestiona cambios de estado y auditoria
@Service
public class ProcessService {
    private final ProcessRepository processRepo;
    private final ProcessAuditRepository auditRepo;

    public ProcessService(ProcessRepository processRepo, ProcessAuditRepository auditRepo) {
        this.processRepo = processRepo;
        this.auditRepo = auditRepo;
    }
    
    // Crea un nuevo proceso en estado inicial CREADO asociado al usuario creador
    public Process createProcess(String title, String description, User creator) {
        Process process = new Process();
        process.setTitle(title);
        process.setDescription(description);
        process.setStatus(ProcessStatus.CREADO);
        process.setCreatedBy(creator);
        return processRepo.save(process);
    }
    
    @Transactional
    // Valida y actualiza el estado del proceso, registra el cambio en auditoria
    public Process updateStatus(Long processId, ProcessStatus newStatus, User changedBy, String comment) {
        Process process = processRepo.findById(processId)
                .orElseThrow(() -> new RuntimeException("Process not found"));
        if (!StateTransitionRules.isValidTransition(process.getStatus(), newStatus)) {
            throw new RuntimeException("Transición no permitida: "+process.getStatus()+" -> "+newStatus);
        }
        ProcessStatus oldStatus = process.getStatus();
        process.setStatus(newStatus);
        Process saved = processRepo.save(process);
        // Registrar auditoría
        ProcessAudit audit = new ProcessAudit();
        audit.setProcess(saved);
        audit.setOldStatus(oldStatus);
        audit.setNewStatus(newStatus);
        audit.setChangedBy(changedBy);
        audit.setComment(comment);
        auditRepo.save(audit);
        return saved;
    }

    // Obtiene todos los procesos creados por un usuario específico
    public List<Process> getProcessesByUser(Long userId){
        return processRepo.findByCreatedById(userId);
    }
    
    // Obtiene todos los procesos del sistema ordenados por fecha de creación más reciente
    public List<Process> getAllProcesses(){
        return processRepo.findAll().stream()
                .sorted(Comparator.comparing(Process::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    // Recupera historial de auditoría de un proceso (más recientes primero)
    public List<ProcessAudit> getAuditHistory(Long processId) {
        return auditRepo.findByProcessIdOrderByChangedAtDesc(processId);
    }
}
