package com.abril.flowboard.dto;

import com.abril.flowboard.enums.ProcessStatus;
import java.time.LocalDateTime;

// DTO para exponer entradas de auditoría de procesos
public record ProcessAuditResponse(Long id, ProcessStatus oldStatus, ProcessStatus newStatus,
                                   String changedByUsername, LocalDateTime changedAt, String comment) {
    public static ProcessAuditResponse from(com.abril.flowboard.model.ProcessAudit a) {
        String username = a.getChangedBy() != null ? a.getChangedBy().getUsername() : null;
        return new ProcessAuditResponse(a.getId(), a.getOldStatus(), a.getNewStatus(), username, a.getChangedAt(), a.getComment());
    }
}
