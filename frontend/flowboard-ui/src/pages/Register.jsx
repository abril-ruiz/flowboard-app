import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../api/client";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  InputAdornment,
  Alert,
} from "@mui/material";
import { Person, Email, Lock } from "@mui/icons-material";
import PasswordStrengthChecker from "../components/PasswordStrengthChecker";
import { validatePassword } from "../utils/passwordValidation";

// Componente de registro de usuario
export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      setPasswordError("");
    }
  };

  // Maneja el envío del formulario de registro
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setPasswordError("");

    const validationError = validatePassword(
      formData.password,
      formData.username,
      formData.email,
    );
    if (validationError) {
      setPasswordError(validationError);
      return;
    }

    try {
      await apiClient.post("/auth/register", formData);
      setSuccess("Usuario creado exitosamente");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const serverError =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error al registrar. El usuario o email ya existen.";
      setError(serverError);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "98vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Formas geométricas de fondo */}
      {/* Triángulos superiores izquierdos */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)",
          clipPath: "polygon(0 0, 60% 0, 0 60%)",
          opacity: 0.25,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "80%",
          height: "80%",
          background: "linear-gradient(135deg, #6d66f1 0%, #a250ef 100%)",
          clipPath: "polygon(0 0, 60% 0, 0 60%)",
          opacity: 0.25,
          zIndex: 0,
        }}
      />
      {/* Triángulo inferior derecho */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #6dacf9 0%, #7e79e1 100%)",
          clipPath: "polygon(100% 100%, 40% 100%, 100% 40%)",
          opacity: 0.25,
          zIndex: 0,
        }}
      />
      <Paper
        elevation={4}
        sx={{
          p: 5,
          width: "100%",
          maxWidth: 420,
          borderRadius: 4,
          position: "relative",
          zIndex: 1,
          background: "#ffffff",
          boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              color: "#4f46e5",
              fontWeight: 770,
            }}
          >
            Crear Cuenta
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mt: 2,
              color: "#0f172a",
              fontWeight: "bold",
              letterSpacing: "0.5px",
            }}
          >
            ¡Únete a FlowBoard!
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            name="username"
            fullWidth
            label="Usuario"
            margin="normal"
            onChange={handleChange}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              },
            }}
            required
          />
          <TextField
            name="email"
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            onChange={handleChange}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              },
            }}
            required
          />
          <TextField
            name="password"
            fullWidth
            label="Contraseña"
            type="password"
            margin="normal"
            onChange={handleChange}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              },
            }}
            required
          />

          {formData.password.length > 0 && (
            <PasswordStrengthChecker
              password={formData.password}
              username={formData.username}
              email={formData.email}
            />
          )}

          {passwordError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {passwordError}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              py: 1.6,
              fontSize: "1rem",
              fontWeight: 700,
              background: "#4f46e5",
              borderRadius: 2.5,
              "&:hover": { background: "#4338ca" },
              boxShadow: "0 4px 14px rgba(79, 70, 229, 0.35)",
              letterSpacing: "0.5px",
            }}
          >
            Registrarse
          </Button>
        </form>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          <Link to="/login" style={{ color: "#4f46e5" }}>
            Volver al Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
