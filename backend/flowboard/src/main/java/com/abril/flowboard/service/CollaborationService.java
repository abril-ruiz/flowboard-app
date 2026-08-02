package com.abril.flowboard.service;
import com.abril.flowboard.dto.*;
import com.abril.flowboard.model.*;
import com.abril.flowboard.repository.*;
import org.springframework.stereotype.Service;
import com.abril.flowboard.model.Process;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

// Servicio de colaboración: gestiona comentarios, etiquetas y estadisticas de procesos
@Service
public class CollaborationService {
    private final CommentRepository commentRepo;
    private final TagRepository tagRepo;
    private final ProcessRepository processRepo;

    public CollaborationService(CommentRepository commentRepo, TagRepository tagRepo, ProcessRepository processRepo) {
        this.commentRepo = commentRepo;
        this.tagRepo = tagRepo;
        this.processRepo = processRepo;
    }

    @Transactional
    // Agrega un comentario a un proceso específico por un autor determinado 
    public Comment addComment(Long processId, String content, com.abril.flowboard.model.User author, NotificationService notificationService) {
        Process p = processRepo.findById(processId).orElseThrow();
        Comment c = new Comment();
        c.setContent(content);
        c.setProcess(p);
        c.setAuthor(author);
        Comment saved = commentRepo.save(c);
        // crear notificación para el creador del proceso si no es quien comenta
        if (p.getCreatedBy() != null && !p.getCreatedBy().getId().equals(author.getId())) {
            String title = "Nuevo comentario en tu proceso";
            String message = "Usuario " + (author.getUsername() != null ? author.getUsername() : "alguien") + " comentó: " + (content.length() > 100 ? content.substring(0, 100) + "..." : content);
            notificationService.create(p.getCreatedBy(), title, message);
        }
        return saved;
    }

    // Recupera todos los comentarios de un proceso en orden cronológico
    public List<Comment> getCommentsByProcess(Long processId) {
        return commentRepo.findByProcessIdOrderByCreatedAtAsc(processId);
    }

    @Transactional
    // Crea o reutiliza una etiqueta y la asocia al proceso
    public void addTagToProcess(Long processId, String tagName) {
        Process p = processRepo.findById(processId).orElseThrow();
        Tag tag = tagRepo.findByName(tagName).orElseGet(() -> {
            Tag newTag = new Tag(); newTag.setName(tagName);
            return tagRepo.save(newTag);
        });
        p.getTags().add(tag);
        processRepo.save(p);
    }

    // Filtra procesos según estado, creador o etiqueta
    public List<Process> filterProcesses(ProcessFilterRequest req) {
        return processRepo.findByFilters(req.status(), req.createdById(), req.tagId());
    }

    // Obtiene estadísticas de procesos agrupadas por estado para el panel
    public DashboardStats getDashboardStats() {
        return DashboardStats.from(processRepo.countByStatus());
    }
}