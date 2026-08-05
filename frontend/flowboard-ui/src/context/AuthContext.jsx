import { createContext, useState, useContext, useEffect } from "react";
import client from "../api/client";
import { getNotifications } from "../api/notificationApi";

const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        // validar token y obtener datos del usuario
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("invalid");
        const data = await res.json();
        const username = data.username;
        const email = data.email || "";
        const role = data.role || null;
        // guardar por si no estaban
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);
        localStorage.setItem("role", role);
        setUser({ token, username, email, role });
        // obtener notificaciones desde el servidor y sincronizar localStorage
        try {
          const notRes = await getNotifications();
          const mapped = (notRes.data || []).map((n) => ({
            id: n.id,
            title: n.title,
            message: n.message,
            timestamp: new Date(n.createdAt).getTime(),
            read: Boolean(n.read),
          }));
          localStorage.setItem("notifications", JSON.stringify(mapped));
        } catch (e) {
          // ignore notification fetch errors
        }
      } catch (err) {
        // token inválido: limpiar y forzar login
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await client.post("/auth/login", { username, password });
      const { token, email, role } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("email", email || "");
      localStorage.setItem("role", role);

      setUser({ token, username, email: email || "", role });

      const welcomeNotification = {
        id: Date.now(),
        title: "Sesión iniciada",
        message: `Bienvenido, ${username}.`,
        timestamp: Date.now(),
        read: false,
      };

      // fetch notifications from server
      try {
        const notRes = await getNotifications();
        const mapped = (notRes.data || []).map((n) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          timestamp: new Date(n.createdAt).getTime(),
          read: Boolean(n.read),
        }));
        const existing = [welcomeNotification, ...mapped].slice(0, 20);
        localStorage.setItem("notifications", JSON.stringify(existing));
      } catch (e) {
        const existing = JSON.parse(
          localStorage.getItem("notifications") || "[]",
        );
        existing.unshift(welcomeNotification);
        localStorage.setItem(
          "notifications",
          JSON.stringify(existing.slice(0, 6)),
        );
      }
      return true;
    } catch (error) {
      console.error("Login fallido:", error);
      return false;
    }
  };
  // Eliminar el token y el usuario al cerrar sesión
  const updateUser = (updatedUser) => {
    setUser((prev) => {
      const nextUser = { ...(prev || {}), ...updatedUser };
      if (nextUser.username)
        localStorage.setItem("username", nextUser.username);
      if (nextUser.email !== undefined)
        localStorage.setItem("email", nextUser.email || "");
      return nextUser;
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
