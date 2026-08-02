import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  Paper,
  InputAdornment,
  IconButton,
  Link,
} from "@mui/material";
import {
  Lock,
  Visibility,
  VisibilityOff,
  AccountCircle,
} from "@mui/icons-material";

// Componente de inicio de sesión
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) navigate("/dashboard");
    else setError("Usuario o contraseña incorrectos");
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
      {/* Triángulo superior izquierdo */}
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
      {/* Triángulos inferiores derechos */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "80%",
          height: "80%",
          background: "linear-gradient(135deg, #60a5fa 0%, #4f46e5 100%)",
          clipPath: "polygon(100% 100%, 40% 100%, 100% 40%)",
          opacity: 0.25,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #60a5fa 0%, #9f9afb 100%)",
          clipPath: "polygon(100% 100%, 40% 100%, 100% 40%)",
          opacity: 0.25,
          zIndex: 0,
        }}
      />

      <Paper
        elevation={3}
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
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              color: "#4f46e5",
              fontWeight: 800,
            }}
          >
            <Box
              component="span"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                border: "2.5px solid #4f46e5",
                borderRadius: 6,
                color: "#4f46e5",
                fontSize: "1.2rem",
              }}
            >
              ✓
            </Box>
            FlowBoard
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
            Bienvenido de nuevo
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
            Inicia sesión para continuar
          </Typography>
        </Box>

        {error && (
          <Typography
            color="error"
            sx={{
              mb: 2,
              textAlign: "center",
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Usuario"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle color="action" />
                  </InputAdornment>
                ),
                style: { fontSize: "1.1rem" },
              },
            }}
            sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
            required
          />

          <TextField
            fullWidth
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                style: { fontSize: "1.1rem" },
              },
            }}
            sx={{ mb: 1.5, "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
            required
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              py: 1.6,
              fontSize: "1.05rem",
              fontWeight: 700,
              background: "#4f46e5",
              borderRadius: 2.5,
              mt: 2,
              "&:hover": { background: "#4338ca" },
              boxShadow: "0 4px 14px rgba(79, 70, 229, 0.35)",
              letterSpacing: "0.5px",
            }}
          >
            INICIAR SESIÓN
          </Button>

          <Typography
            variant="body2"
            sx={{ textAlign: "center", mt: 3.5, color: "#64748b" }}
          >
            ¿No tienes una cuenta?{" "}
            <RouterLink
              to="/register"
              style={{
                color: "#4f46e5",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Regístrate
            </RouterLink>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
}
