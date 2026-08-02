import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Badge,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import Divider from "@mui/material/Divider";
import { formatTimeAgo } from "../utils/timeAgo";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [, setTick] = useState(0);

  // Cargar notificaciones al montar o cambiar de ruta
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("notifications") || "[]");
      const normalized = stored.map((n) => ({
        ...n,
        read: Boolean(n.read),
        timestamp: n.timestamp || n.time || Date.now(),
      }));
      setNotifications(normalized);
    } catch {
      setNotifications([]);
    }
  }, [location.pathname]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTick((prev) => prev + 1);
    }, 60000);

    return () => window.clearInterval(interval);
  }, []);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleNotifMenu = (event) => {
    setShowAllNotifications(false);
    setNotifAnchorEl(event.currentTarget);
  };
  const handleNotifClose = () => setNotifAnchorEl(null);

  // Marcar como leída
  const markAsRead = (id) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n,
    );
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  const isActive = (path) => location.pathname === path;
  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayedNotifs = showAllNotifications
    ? notifications
    : notifications.slice(0, 3);

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{ background: "#fff", color: "#1e293b" }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Izquierda: Logo y Nav */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            color="#4f46e5"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/dashboard")}
          >
            FlowBoard
          </Typography>
          <Button
            startIcon={<DashboardIcon />}
            onClick={() => navigate("/dashboard")}
            sx={{
              color: isActive("/dashboard") ? "#4f46e5" : "inherit",
              fontWeight: isActive("/dashboard") ? 600 : 400,
            }}
          >
            Dashboard
          </Button>
          <Button
            startIcon={<ListAltIcon />}
            onClick={() => navigate("/processes")}
            sx={{
              color: isActive("/processes") ? "#4f46e5" : "inherit",
              fontWeight: isActive("/processes") ? 600 : 400,
            }}
          >
            Procesos
          </Button>
        </Box>

        {/* Derecha: Notificaciones + Usuario */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            size="small"
            onClick={handleNotifMenu}
            sx={{ color: "#64748b" }}
          >
            <Badge
              badgeContent={unreadCount}
              color="error"
              size="small"
              invisible={unreadCount === 0}
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton onClick={handleMenu} size="small">
            <Avatar
              sx={{
                width: 32,
                height: 32,
                background: "#4f46e5",
                fontSize: "0.9rem",
              }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          {/* Menú de usuario */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <MenuItem
              onClick={() => {
                handleClose();
                navigate("/profile");
              }}
            >
              <SettingsIcon sx={{ mr: 1.5 }} fontSize="small" /> Configuración
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                logout();
                navigate("/login");
              }}
              sx={{ color: "#ef4444" }}
            >
              <LogoutIcon sx={{ mr: 1.5 }} fontSize="small" /> Cerrar Sesión
            </MenuItem>
          </Menu>
          {/* Menú de notificaciones */}
          <Menu
            anchorEl={notifAnchorEl}
            open={Boolean(notifAnchorEl)}
            onClose={handleNotifClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            sx={{ mt: 1 }}
          >
            <Typography
              variant="subtitle2"
              sx={{ px: 2, py: 1, fontWeight: 600, color: "#1e293b" }}
            >
              Notificaciones {unreadCount > 0 && `(${unreadCount})`}
            </Typography>
            <Divider />
            {notifications.length === 0 ? (
              <MenuItem sx={{ py: 1.5, px: 2, color: "text.secondary" }}>
                No hay notificaciones nuevas.
              </MenuItem>
            ) : (
              displayedNotifs.map((item) => (
                <MenuItem
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  sx={{
                    py: 1.2,
                    px: 2,
                    alignItems: "flex-start",
                    backgroundColor: item.read ? "#f8fafc" : "#eef2ff",
                    borderLeft: item.read ? "none" : "3px solid #4f46e5",
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight={item.read ? 500 : 700}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.3 }}
                    >
                      {item.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatTimeAgo(item.timestamp)}
                    </Typography>
                  </Box>
                </MenuItem>
              ))
            )}
            <Divider />
            {notifications.length > 3 && (
              <MenuItem
                onClick={() => setShowAllNotifications((prev) => !prev)}
                sx={{
                  justifyContent: "center",
                  color: "#4f46e5",
                  fontWeight: 600,
                }}
              >
                {showAllNotifications ? "Ver menos" : "Ver todas"}
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
