package com.abril.flowboard.service;

import com.abril.flowboard.model.Notification;
import com.abril.flowboard.model.User;
import com.abril.flowboard.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import java.util.List;
// Servicio para manejar notificaciones, incluyendo creación, obtención y marcado como leídas.
@Service
public class NotificationService {
    private final NotificationRepository repo;

    public NotificationService(NotificationRepository repo) {
        this.repo = repo;
    }
// Crea una nueva notificación para un usuario específico con un título y mensaje dados.
    public Notification create(User recipient, String title, String message) {
        Notification n = new Notification();
        n.setRecipient(recipient);
        n.setTitle(title);
        n.setMessage(message);
        return repo.save(n);
    }
// Obtiene todas las notificaciones para un usuario específico, ordenadas por fecha de creación en orden descendente.
    public List<Notification> getForUser(Long userId) {
        return repo.findByRecipientIdOrderByCreatedAtDesc(userId);
    }
// Marca una notificación como leída.
    public void markRead(Long id) {
        var opt = repo.findById(id);
        if (opt.isPresent()) {
            var n = opt.get();
            n.setRead(true);
            repo.save(n);
        }
    }
}
