import { useEffect, useState } from "react";
import {
  Avatar,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import SecurityIcon from "@mui/icons-material/Security";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PasswordStrengthChecker from "../components/PasswordStrengthChecker";
import { validatePassword } from "../utils/passwordValidation";

// Página de perfil de usuario
export default function Profile() {
  const { user, updateUser } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [passwordModalError, setPasswordModalError] = useState("");

  const [targetUserId, setTargetUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const isRoleChangeDisabled = !targetUserId || !selectedRole;

  // Sincronizar el formulario con los datos del usuario cuando se cargue o cambie
  useEffect(() => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  }, [user]);

  // Función para manejar la actualización del perfil
  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await apiClient.put("/user/profile", {
        username: formData.username,
        email: formData.email,
      });

      updateUser({
        username: response.data.username || formData.username,
        email: response.data.email || formData.email,
      });

      const existing = JSON.parse(
        localStorage.getItem("notifications") || "[]",
      );
      existing.unshift({
        id: Date.now(),
        title: "Perfil actualizado",
        message: "Tus datos personales se actualizaron correctamente.",
        timestamp: Date.now(),
        read: false,
      });
      localStorage.setItem(
        "notifications",
        JSON.stringify(existing.slice(0, 6)),
      );

      setSuccess("Perfil actualizado correctamente");
      setIsEditingProfile(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("No se pudo actualizar el perfil. Verifica tus datos.");
    }
  };
  // Función para manejar el cambio de contraseña
  const handleChangePassword = async () => {
    setPasswordModalError("");
    setSuccess("");

    if (formData.newPassword !== formData.confirmNewPassword) {
      setPasswordModalError("Las nuevas contraseñas no coinciden");
      return;
    }

    const validationError = validatePassword(
      formData.newPassword,
      user?.username,
      user?.email,
    );
    if (validationError) {
      setPasswordModalError(validationError);
      return;
    }

    try {
      await apiClient.put("/user/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmNewPassword,
      });

      const existing = JSON.parse(
        localStorage.getItem("notifications") || "[]",
      );
      existing.unshift({
        id: Date.now(),
        title: "Contraseña actualizada",
        message: "Tu contraseña se cambió correctamente.",
        timestamp: Date.now(),
        read: false,
      });
      localStorage.setItem(
        "notifications",
        JSON.stringify(existing.slice(0, 6)),
      );

      setSuccess("Contraseña cambiada correctamente");
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setPasswordModalError("");
      setIsPasswordModalOpen(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "No se pudo cambiar la contraseña. Revisa los requisitos.";
      setPasswordModalError(errorMsg);
    }
  };
  // Función para manejar el cambio de rol (solo para admins)
  const handleRoleChange = async () => {
    if (!targetUserId || !selectedRole) {
      setError("Seleccioná un ID y un rol válidos");
      return;
    }

    try {
      await apiClient.put(`/admin/users/${targetUserId}/role`, null, {
        params: { newRole: selectedRole },
      });
      setSuccess(
        `El rol del usuario #${targetUserId} se actualizó correctamente.`,
      );
      setTargetUserId("");
      setSelectedRole("");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error al actualizar rol";
      setError(msg);
    }
  };

  // Función para cancelar edición de perfil
  const handleCancelEdit = () => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setIsEditingProfile(false);
  };

  // Función para cerrar modal de contraseña
  const handleClosePasswordModal = () => {
    setFormData({
      ...formData,
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setPasswordModalError("");
    setIsPasswordModalOpen(false);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", pb: 4 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
        color="#1e293b"
        align="center"
      >
        Configuración de Usuario
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Tarjeta de Perfil con Edición In-Place */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3, marginTop: 1 }}>
        <CardContent sx={{ p: 3.5 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 3,
              mb: 3,
            }}
          >
            <Avatar
              sx={{
                width: 88,
                height: 88,
                bgcolor: "#4f46e5",
                fontSize: "2rem",
                boxShadow: 2,
              }}
            >
              {(user?.username || "U").charAt(0).toUpperCase()}
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" fontWeight="700" mb={0.5}>
                {isEditingProfile
                  ? "Editar Información"
                  : "Información del Usuario"}
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={2}>
                {isEditingProfile
                  ? "Actualiza tus datos personales en tiempo real."
                  : "Revisa tus datos actuales y edita tu perfil cuando quieras."}
              </Typography>

              {!isEditingProfile ? (
                <Box sx={{ display: "grid", gap: 1.2, marginTop: 1 }}>
                  <Typography variant="body1">
                    <strong>Usuario:</strong> {user?.username || "—"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Email:</strong> {user?.email || "—"}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: "grid", gap: 2, marginTop: 2 }}>
                  <TextField
                    fullWidth
                    label="Usuario"
                    size="small"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    slotProps={{
                      input: {
                        startAdornment: (
                          <PersonIcon sx={{ mr: 1, color: "action" }} />
                        ),
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Correo Electrónico"
                    size="small"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    slotProps={{
                      input: {
                        startAdornment: (
                          <EmailIcon sx={{ mr: 1, color: "action" }} />
                        ),
                      },
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>

          {/* Botones de Acción */}
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              justifyContent: "flex-end",
              flexWrap: "wrap",
            }}
          >
            {!isEditingProfile ? (
              <>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditingProfile(true)}
                  sx={{
                    background: "#4f46e5",
                    px: 2.5,
                    py: 1,
                    "&:hover": { background: "#4338ca" },
                  }}
                >
                  Editar Información
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<LockIcon />}
                  onClick={() => setIsPasswordModalOpen(true)}
                  sx={{
                    borderColor: "#4f46e5",
                    color: "#4f46e5",
                    px: 2.5,
                    py: 1,
                    "&:hover": {
                      background: "rgba(79, 70, 229, 0.08)",
                      borderColor: "#4338ca",
                    },
                  }}
                >
                  Cambiar Contraseña
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelEdit}
                  sx={{
                    borderColor: "#ef4444",
                    color: "#ef4444",
                    px: 2.5,
                    py: 1,
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<CheckCircleIcon />}
                  onClick={handleSave}
                  sx={{
                    background: "#10b981",
                    px: 2.5,
                    py: 1,
                    "&:hover": { background: "#059669" },
                  }}
                >
                  Guardar Cambios
                </Button>
              </>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Tarjeta de Gestión de Permisos (Solo para Admins) */}
      {user?.role === "ADMIN" && (
        <Card
          sx={{
            mb: 3,
            borderRadius: 3,
            boxShadow: 2,
            border: "2px solid #6366f1",
            background: "linear-gradient(135deg, #f0f4ff 0%, #f8f9ff 100%)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
            >
              <SecurityIcon sx={{ color: "#6366f1", fontSize: "1.8rem" }} />
              <Typography
                variant="h5"
                fontWeight="700"
                sx={{ color: "#1e293b" }}
              >
                Gestión de Permisos
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" mb={2.5}>
              Cambia el rol de otro usuario sin afectar tu propia cuenta.
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 1.5,
              }}
            >
              <TextField
                label="ID de usuario"
                type="number"
                size="small"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                slotProps={{
                  htmlInput: { min: 1 },
                }}
                sx={{
                  minWidth: { sm: 180 },
                  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                    borderColor: "#6366f1",
                  },
                }}
              />
              <Select
                size="small"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                displayEmpty
                sx={{
                  minWidth: { sm: 180 },
                  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                    borderColor: "#6366f1",
                  },
                }}
              >
                <MenuItem value="" disabled>
                  Seleccionar rol...
                </MenuItem>
                <MenuItem value="USER">USER</MenuItem>
                <MenuItem value="ADMIN">ADMIN</MenuItem>
              </Select>
              <Button
                variant="contained"
                size="small"
                onClick={handleRoleChange}
                disabled={isRoleChangeDisabled}
                sx={{
                  background: "#6366f1",
                  whiteSpace: "nowrap",
                  minWidth: 140,
                  "&:hover": { background: "#4f46e5" },
                  "&:disabled": { background: "#d1d5db" },
                }}
              >
                Aplicar Cambio
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Modal de Cambio de Contraseña */}
      <Dialog
        open={isPasswordModalOpen}
        onClose={handleClosePasswordModal}
        maxWidth="sm"
        fullWidth
        paperprops={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            fontWeight: 700,
            fontSize: "1.25rem",
            color: "#1e293b",
          }}
        >
          <LockIcon sx={{ color: "#4f46e5" }} />
          Cambiar Contraseña
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {passwordModalError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {passwordModalError}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Contraseña Actual"
            type="password"
            value={formData.currentPassword}
            onChange={(e) =>
              setFormData({ ...formData, currentPassword: e.target.value })
            }
            margin="normal"
            variant="outlined"
            slotProps={{
              input: {
                startAdornment: <LockIcon sx={{ mr: 1, color: "action" }} />,
              },
            }}
          />
          <TextField
            fullWidth
            label="Nueva Contraseña"
            type="password"
            value={formData.newPassword}
            onChange={(e) =>
              setFormData({ ...formData, newPassword: e.target.value })
            }
            margin="normal"
            variant="outlined"
            slotProps={{
              input: {
                startAdornment: <LockIcon sx={{ mr: 1, color: "action" }} />,
              },
            }}
          />
          {/* Componente de validación visual de contraseña */}
          {formData.newPassword.length > 0 && (
            <PasswordStrengthChecker
              password={formData.newPassword}
              username={user?.username}
              email={user?.email}
            />
          )}
          <TextField
            fullWidth
            label="Confirmar Nueva Contraseña"
            type="password"
            value={formData.confirmNewPassword}
            onChange={(e) =>
              setFormData({
                ...formData,
                confirmNewPassword: e.target.value,
              })
            }
            margin="normal"
            variant="outlined"
            slotProps={{
              input: {
                startAdornment: <LockIcon sx={{ mr: 1, color: "action" }} />,
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button
            onClick={handleClosePasswordModal}
            variant="outlined"
            sx={{
              borderColor: "#d1d5db",
              color: "#6b7280",
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            sx={{
              background: "#4f46e5",
              "&:hover": { background: "#4338ca" },
            }}
          >
            Cambiar Contraseña
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
