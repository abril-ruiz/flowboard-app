import { Box, Typography, Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

/**
 * Componente de validación visual para contraseñas NIST
 * Muestra en tiempo real los requisitos cumplidos
 */
export default function PasswordStrengthChecker({ password, username, email }) {
  // Validaciones individuales
  const checks = {
    length: password.length >= 12,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[@#$%^&+=*!._\-]/.test(password),
    noUsername: !password.toLowerCase().includes(username?.toLowerCase() || ""),
    noEmail: !password
      .toLowerCase()
      .includes(email?.split("@")[0]?.toLowerCase() || ""),
  };

  // Contar tipos de caracteres (mayúscula, minúscula, número, especial)
  const typeCount = [
    checks.hasUppercase,
    checks.hasLowercase,
    checks.hasNumber,
    checks.hasSpecial,
  ].filter(Boolean).length;

  const hasRequiredTypes = typeCount >= 3;
  const isValid =
    checks.length &&
    hasRequiredTypes &&
    checks.noUsername &&
    checks.noEmail &&
    password.length > 0;

  return (
    <Box sx={{ mt: 2.5, mb: 2 }}>
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 600, mb: 1.5, color: "#374151" }}
      >
        Requisitos de Contraseña (NIST)
      </Typography>

      <Box sx={{ display: "grid", gap: 1, mb: 2 }}>
        {/* Longitud */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {checks.length ? (
            <CheckCircleIcon sx={{ color: "#10b981", fontSize: "1.25rem" }} />
          ) : (
            <CancelIcon sx={{ color: "#d1d5db", fontSize: "1.25rem" }} />
          )}
          <Typography
            variant="body2"
            sx={{ color: checks.length ? "#10b981" : "#6b7280" }}
          >
            Mínimo 12 caracteres{" "}
            {password.length > 0 && `(${password.length} ingresados)`}
          </Typography>
        </Box>

        {/* Tipos de caracteres */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {hasRequiredTypes ? (
            <CheckCircleIcon sx={{ color: "#10b981", fontSize: "1.25rem" }} />
          ) : (
            <CancelIcon sx={{ color: "#d1d5db", fontSize: "1.25rem" }} />
          )}
          <Typography
            variant="body2"
            sx={{ color: hasRequiredTypes ? "#10b981" : "#6b7280" }}
          >
            Al menos 3 de 4 tipos de caracteres ({typeCount}/4)
          </Typography>
        </Box>

        {/* Sub-requisitos de tipos */}
        <Box sx={{ pl: 4, display: "grid", gap: 0.75 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {checks.hasUppercase ? (
              <CheckCircleIcon sx={{ color: "#10b981", fontSize: "1rem" }} />
            ) : (
              <CancelIcon sx={{ color: "#d1d5db", fontSize: "1rem" }} />
            )}
            <Typography
              variant="caption"
              sx={{ color: checks.hasUppercase ? "#10b981" : "#9ca3af" }}
            >
              Mayúscula (A-Z)
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {checks.hasLowercase ? (
              <CheckCircleIcon sx={{ color: "#10b981", fontSize: "1rem" }} />
            ) : (
              <CancelIcon sx={{ color: "#d1d5db", fontSize: "1rem" }} />
            )}
            <Typography
              variant="caption"
              sx={{ color: checks.hasLowercase ? "#10b981" : "#9ca3af" }}
            >
              Minúscula (a-z)
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {checks.hasNumber ? (
              <CheckCircleIcon sx={{ color: "#10b981", fontSize: "1rem" }} />
            ) : (
              <CancelIcon sx={{ color: "#d1d5db", fontSize: "1rem" }} />
            )}
            <Typography
              variant="caption"
              sx={{ color: checks.hasNumber ? "#10b981" : "#9ca3af" }}
            >
              Número (0-9)
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {checks.hasSpecial ? (
              <CheckCircleIcon sx={{ color: "#10b981", fontSize: "1rem" }} />
            ) : (
              <CancelIcon sx={{ color: "#d1d5db", fontSize: "1rem" }} />
            )}
            <Typography
              variant="caption"
              sx={{ color: checks.hasSpecial ? "#10b981" : "#9ca3af" }}
            >
              Especial (@#$%*!._-)
            </Typography>
          </Box>
        </Box>

        {/* No contiene username */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {checks.noUsername ? (
            <CheckCircleIcon sx={{ color: "#10b981", fontSize: "1.25rem" }} />
          ) : (
            <CancelIcon sx={{ color: "#ef4444", fontSize: "1.25rem" }} />
          )}
          <Typography
            variant="body2"
            sx={{ color: checks.noUsername ? "#10b981" : "#ef4444" }}
          >
            No contiene el nombre de usuario
          </Typography>
        </Box>

        {/* No contiene email */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {checks.noEmail ? (
            <CheckCircleIcon sx={{ color: "#10b981", fontSize: "1.25rem" }} />
          ) : (
            <CancelIcon sx={{ color: "#ef4444", fontSize: "1.25rem" }} />
          )}
          <Typography
            variant="body2"
            sx={{ color: checks.noEmail ? "#10b981" : "#ef4444" }}
          >
            No contiene datos del email
          </Typography>
        </Box>
      </Box>

      {/* Estado general */}
      {password.length > 0 && (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="caption" sx={{ color: "#6b7280" }}>
            Estado de la contraseña:
          </Typography>
          <Chip
            icon={isValid ? <CheckCircleIcon /> : <CancelIcon />}
            label={isValid ? "Válida" : "No válida"}
            color={isValid ? "success" : "default"}
            size="small"
            variant={isValid ? "filled" : "outlined"}
            sx={{
              fontWeight: 600,
              minWidth: 120,
              justifyContent: "center",
            }}
          />
        </Box>
      )}
    </Box>
  );
}
