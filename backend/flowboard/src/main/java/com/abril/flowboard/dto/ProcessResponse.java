package com.abril.flowboard.dto;

import com.abril.flowboard.enums.ProcessStatus;
import java.time.LocalDateTime;

// DTO de respuesta para procesos. Incluye el nombre de usuario del creador
public record ProcessResponse(Long id, String title, String description, ProcessStatus status,
                              Long createdById, String createdByUsername, String lastEditedByUsername, LocalDateTime createdAt, LocalDateTime updatedAt) {
    // Mapea la entidad Process a un DTO para la respuesta HTTP.
    public static ProcessResponse from(com.abril.flowboard.model.Process p) {
        return from(p, null);
    }

    public static ProcessResponse from(com.abril.flowboard.model.Process p, String lastEditedByUsername) {
        Long creatorId = p.getCreatedBy() != null ? p.getCreatedBy().getId() : null;
        String creatorUsername = p.getCreatedBy() != null ? p.getCreatedBy().getUsername() : null;
        return new ProcessResponse(p.getId(), p.getTitle(), p.getDescription(), p.getStatus(),
                creatorId, creatorUsername, lastEditedByUsername, p.getCreatedAt(), p.getUpdatedAt());
    }
}
