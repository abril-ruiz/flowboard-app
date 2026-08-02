package com.abril.flowboard.dto;
import java.util.Map;
import java.util.List;

public record DashboardStats(long total, long activos, long finalizados, Map<String, Long> porEstado) {
    // Construye estadísticas a partir del conteo por estado obtenido de la base de datos.
    public static DashboardStats from(List<Map<String, Object>> rawData) {
        Map<String, Long> map = rawData.stream().collect(java.util.stream.Collectors.toMap(
            r -> r.get("status").toString(), r -> ((Number) r.get("count")).longValue()
        ));
        long total = map.values().stream().mapToLong(Long::longValue).sum();
        long activos = map.getOrDefault("EN_PROGRESO", 0L) + map.getOrDefault("EN_REVISION", 0L) + map.getOrDefault("CREADO", 0L);
        long finalizados = map.getOrDefault("APROBADO", 0L) + map.getOrDefault("RECHAZADO", 0L);
        return new DashboardStats(total, activos, finalizados, map);
    }
}
