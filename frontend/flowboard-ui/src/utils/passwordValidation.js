//Constantes de validación NIST para contraseñas

// Requisitos de longitud
export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 12,
  DESCRIPTION: "Mínimo 12 caracteres con al menos 3 de 4 tipos de caracteres",
};

// Patrones Regex para validación
export const PASSWORD_PATTERNS = {
  UPPERCASE: /[A-Z]/,
  LOWERCASE: /[a-z]/,
  NUMBER: /[0-9]/,
  SPECIAL: /[@#$%^&+=*!._\-]/,
};

// Mensajes de error estándar
export const PASSWORD_ERROR_MESSAGES = {
  TOO_SHORT: `La contraseña debe tener al menos ${PASSWORD_REQUIREMENTS.MIN_LENGTH} caracteres`,
  INSUFFICIENT_COMPLEXITY:
    "La contraseña debe incluir al menos 3 de: mayúsculas, minúsculas, números y caracteres especiales",
  CONTAINS_USERNAME: "La contraseña no debe contener el nombre de usuario",
  CONTAINS_EMAIL: "La contraseña no debe contener datos del email",
  PASSWORDS_DONT_MATCH: "Las nuevas contraseñas no coinciden",
  SAME_AS_CURRENT: "La nueva contraseña debe ser diferente a la actual",
};

// Validar la complejidad de una contraseña según NIST
export function getPasswordTypeCount(password) {
  let count = 0;
  if (PASSWORD_PATTERNS.UPPERCASE.test(password)) count++;
  if (PASSWORD_PATTERNS.LOWERCASE.test(password)) count++;
  if (PASSWORD_PATTERNS.NUMBER.test(password)) count++;
  if (PASSWORD_PATTERNS.SPECIAL.test(password)) count++;
  return count; // Devuelve el número de tipos de caracteres encontrados (0-4)
}

// Verificar si una contraseña cumple con todos los requisitos NIST
export function validatePassword(password, username, email) {
  // Validar longitud
  if (password.length < PASSWORD_REQUIREMENTS.MIN_LENGTH) {
    return PASSWORD_ERROR_MESSAGES.TOO_SHORT;
  }

  // Validar que no contenga username
  if (password.toLowerCase().includes(username?.toLowerCase() || "")) {
    return PASSWORD_ERROR_MESSAGES.CONTAINS_USERNAME;
  }

  // Validar que no contenga email (verificar parte antes de @)
  const emailPrefix = email?.split("@")[0]?.toLowerCase() || "";
  if (emailPrefix && password.toLowerCase().includes(emailPrefix)) {
    return PASSWORD_ERROR_MESSAGES.CONTAINS_EMAIL;
  }

  // Validar complejidad (al menos 3 de 4)
  const typeCount = getPasswordTypeCount(password);
  if (typeCount < 3) {
    return PASSWORD_ERROR_MESSAGES.INSUFFICIENT_COMPLEXITY;
  }

  return null;
}
