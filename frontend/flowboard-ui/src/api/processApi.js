import apiClient from "./client";

// Obtiene procesos con filtros opcionales
export const getProcesses = (filters = {}) =>
  apiClient.get("/processes/filter", { params: filters });
// Crea un nuevo proceso
export const createProcess = (data) => apiClient.post("/processes", data);
// Obtiene procesos por ID
export const getProcessById = (id) => apiClient.get(`/processes/${id}`);
// Actualiza el estado de un proceso
export const updateStatus = (id, data) =>
  apiClient.put(`/processes/${id}/status`, data);
// Obtiene comentarios de un proceso
export const getComments = (id) => apiClient.get(`/processes/${id}/comments`);
// Agrega un comentario a un proceso
export const addComment = (id, data) =>
  apiClient.post(`/processes/${id}/comments`, data);
// Obtiene historial de cambios (auditoría) de un proceso
export const getProcessHistory = (id) => apiClient.get(`/processes/${id}/history`);
