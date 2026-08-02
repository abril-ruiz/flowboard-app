package com.abril.flowboard.repository;

import com.abril.flowboard.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // Encuentra todas las notificaciones para un ID específico, ordenadas por fecha de creación en orden descendente
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(Long recipientId);
}
