// Funcion para formatear el tiempo transcurrido desde un timestamp dado
export function formatTimeAgo(timestamp) {
  if (!timestamp) return "justo ahora";

  const now = Date.now();
  const diff = Math.max(0, now - Number(timestamp));
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `Hace ${days} día${days > 1 ? "s" : ""}`;
  if (hours > 0) return `Hace ${hours} hora${hours > 1 ? "s" : ""}`;
  if (minutes > 0) return `Hace ${minutes} minuto${minutes > 1 ? "s" : ""}`;
  if (seconds > 0) return `Hace ${seconds} segundo${seconds > 1 ? "s" : ""}`;
  return "Justo ahora";
}
