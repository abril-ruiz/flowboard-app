package com.abril.flowboard.controller;
import com.abril.flowboard.dto.*;
import com.abril.flowboard.model.Comment;
import com.abril.flowboard.enums.ProcessStatus;
import com.abril.flowboard.service.CollaborationService;
import com.abril.flowboard.service.UserService;
import com.abril.flowboard.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

/*
 Maneja comentarios, etiquetas (tags), filtrado de procesos y estadísticas.
 Facilita la interacción multi-usuario alrededor de los procesos.
 */
@RestController
@RequestMapping("/api")
public class CollaborationController {
    private final CollaborationService service;
    private final com.abril.flowboard.service.ProcessService processService;
    private final UserService userService;
    private final NotificationService notificationService;

    public CollaborationController(CollaborationService service, com.abril.flowboard.service.ProcessService processService, UserService userService, NotificationService notificationService) {
        this.service = service;
        this.processService = processService;
        this.userService = userService;
        this.notificationService = notificationService;
    }

    // Agrega un comentario a un proceso
    @PostMapping("/processes/{id}/comments")
    public ResponseEntity<CommentResponse> addComment(@PathVariable Long id,
                                                      @Valid @RequestBody CommentRequest req) {
        var currentUser = userService.getCurrentUser();
        Comment c = service.addComment(id, req.content(), currentUser, notificationService);
        String author = c.getAuthor() != null ? c.getAuthor().getUsername() : "Usuario";
        return ResponseEntity.ok(new CommentResponse(c.getId(), c.getContent(), author, c.getCreatedAt()));
    }

    //Obtiene todos los comentarios de un proceso. Incluye historial completo de conversaciones/colaboración
    @GetMapping("/processes/{id}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long id) {
        List<Comment> comments = service.getCommentsByProcess(id);
        List<CommentResponse> resp = comments.stream().map(c -> 
            new CommentResponse(c.getId(), c.getContent(), c.getAuthor() != null ? c.getAuthor().getUsername() : "Usuario", c.getCreatedAt())
        ).collect(Collectors.toList());
        return ResponseEntity.ok(resp);
    }

    // Agrega una etiqueta (tag) a un proceso. Permite categorizar y organizar procesos por temas, prioridades, etc.
    @PostMapping("/processes/{id}/tags/{tagName}")
    public ResponseEntity<Void> addTag(@PathVariable Long id, @PathVariable String tagName) {
        service.addTagToProcess(id, tagName);
        return ResponseEntity.ok().build();
    }

    // Filtra procesos según criterios específicos. Permite encontrar procesos por estado, creador, etiquetas, etc.
    @GetMapping("/processes/filter")
    public ResponseEntity<List<ProcessResponse>> filter(ProcessStatus status,
                                                        Long createdById, Long tagId) {
        var req = new ProcessFilterRequest(status, createdById, tagId);
        var procs = service.filterProcesses(req);
        var resp = procs.stream().map(p -> {
            var audits = processService.getAuditHistory(p.getId());
            String lastEditor = audits.isEmpty() ? null : (audits.get(0).getChangedBy() != null ? audits.get(0).getChangedBy().getUsername() : null);
            return ProcessResponse.from(p, lastEditor);
        }).toList();
        return ResponseEntity.ok(resp);
    }

    //Obtiene estadísticas del dashboard. Es útil para mostrar métricas clave como número de procesos por estado, actividad reciente, etc.
    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStats> stats() {
        return ResponseEntity.ok(service.getDashboardStats());
    }
}