package com.abril.flowboard.dto;

import java.time.LocalDateTime;

// DTO para representar una notificacion en la respuesta de la API
public record NotificationResponse(Long id, String title, String message, boolean read, LocalDateTime createdAt) {
    public static NotificationResponse from(com.abril.flowboard.model.Notification n) {
        return new NotificationResponse(n.getId(), n.getTitle(), n.getMessage(), n.isRead(), n.getCreatedAt());
    }
}
