import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
const client = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});
// Se ejecuta antes de cada petición para agregar el token de autenticación
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);
// Se ejecuta si la respuesta es un error
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Si el token es inválido o ha expirado, se elimina y se redirige al login
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default client;
