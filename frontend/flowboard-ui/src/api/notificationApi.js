import apiClient from "./client";
// Obtiene todas las notificaciones
export const getNotifications = () => apiClient.get("/notifications");
// Marca una notificación como leída
export const markNotificationRead = (id) =>
  apiClient.put(`/notifications/${id}/read`);
