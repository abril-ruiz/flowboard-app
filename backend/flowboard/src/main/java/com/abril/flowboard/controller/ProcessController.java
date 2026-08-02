package com.abril.flowboard.controller;
import com.abril.flowboard.dto.*;
import com.abril.flowboard.service.ProcessService;
import com.abril.flowboard.service.UserService;
import com.abril.flowboard.repository.ProcessRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/*
  Maneja operaciones CRUD de procesos.
  Todos los endpoints requieren autenticación JWT excepto donde se especifique
 */
@RestController
@RequestMapping("/api/processes")
public class ProcessController {
    private final ProcessService processService;
    private final UserService userService;
    private final ProcessRepository processRepo;
    private final com.abril.flowboard.repository.ProcessAuditRepository auditRepo;

    public ProcessController(ProcessService processService, UserService userService, ProcessRepository processRepo, com.abril.flowboard.repository.ProcessAuditRepository auditRepo) {
        this.processService = processService;
        this.userService = userService;
        this.processRepo = processRepo;
        this.auditRepo = auditRepo;
    }

    //Crea un nuevo proceso. 
    @PostMapping
    public ResponseEntity<ProcessResponse> create(@Valid @RequestBody ProcessRequest req) {
        var currentUser = userService.getCurrentUser();
        var process = processService.createProcess(req.title(), req.description(), currentUser);
        return ResponseEntity.ok(ProcessResponse.from(process));
    }

    //Retorna lista completa de procesos del sistema. 
    @GetMapping
    public ResponseEntity<List<ProcessResponse>> getAll() {
        var processes = processService.getAllProcesses();
        return ResponseEntity.ok(processes.stream().map(ProcessResponse::from).toList());
    }
    // Retorna un proceso por su ID.
    @GetMapping("/{id}")
    public ResponseEntity<ProcessResponse> getById(@PathVariable Long id) {
    var process = processRepo.findById(id)
        .orElseThrow(() -> new RuntimeException("Proceso no encontrado"));
    // obtener último editor desde auditoría si existe
    var audits = processService.getAuditHistory(id);
    String lastEditor = audits.isEmpty() ? null : (audits.get(0).getChangedBy() != null ? audits.get(0).getChangedBy().getUsername() : null);
    return ResponseEntity.ok(ProcessResponse.from(process, lastEditor));
    }

    // Actualiza el estado de un proceso. 
    @PutMapping("/{id}/status")
    public ResponseEntity<ProcessResponse> updateStatus(@PathVariable Long id,
                                                        @Valid @RequestBody StatusUpdateRequest req) {
        var currentUser = userService.getCurrentUser();
        var updated = processService.updateStatus(id, req.newStatus(), currentUser, req.comment());
        var audits = processService.getAuditHistory(id);
        String lastEditor = audits.isEmpty() ? null : (audits.get(0).getChangedBy() != null ? audits.get(0).getChangedBy().getUsername() : null);
        return ResponseEntity.ok(ProcessResponse.from(updated, lastEditor));
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<java.util.List<com.abril.flowboard.dto.ProcessAuditResponse>> history(@PathVariable Long id) {
        var audits = processService.getAuditHistory(id);
        var resp = audits.stream().map(com.abril.flowboard.dto.ProcessAuditResponse::from).toList();
        return ResponseEntity.ok(resp);
    }
}