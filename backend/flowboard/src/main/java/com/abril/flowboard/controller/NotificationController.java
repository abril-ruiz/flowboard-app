package com.abril.flowboard.controller;

import com.abril.flowboard.dto.NotificationResponse;
import com.abril.flowboard.service.NotificationService;
import com.abril.flowboard.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService notificationService;
    private final UserService userService;

    public NotificationController(NotificationService notificationService, UserService userService) {
        this.notificationService = notificationService;
        this.userService = userService;
    }
// Funcion para listar las notificaciones del usuario actual
    @GetMapping
    public ResponseEntity<List<NotificationResponse>> list() {
        var user = userService.getCurrentUser();
        var notifs = notificationService.getForUser(user.getId()).stream().map(NotificationResponse::from).toList();
        return ResponseEntity.ok(notifs);
    }
// Funcion para marcar una notificacion como leida
    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markRead(@PathVariable Long id) {
        notificationService.markRead(id);
        return ResponseEntity.ok().build();
    }
}
