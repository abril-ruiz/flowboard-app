package com.abril.flowboard.enums;
import java.util.Map;
import java.util.List;

// Reglas de transición de estado para validar cambios de proceso
public class StateTransitionRules {
    private static final Map<ProcessStatus, List<ProcessStatus>> allowedTransitions = Map.of(
        ProcessStatus.CREADO, List.of(ProcessStatus.EN_PROGRESO, ProcessStatus.RECHAZADO),
        ProcessStatus.EN_PROGRESO, List.of(ProcessStatus.EN_REVISION, ProcessStatus.RECHAZADO),
        ProcessStatus.EN_REVISION, List.of(ProcessStatus.APROBADO, ProcessStatus.RECHAZADO, ProcessStatus.EN_PROGRESO),
        ProcessStatus.APROBADO, List.of(),
        ProcessStatus.RECHAZADO, List.of(ProcessStatus.EN_PROGRESO) // permitir reabrir
    );

    // Verifica si pasar de un estado actual a uno nuevo está permitido
    public static boolean isValidTransition(ProcessStatus current, ProcessStatus next) {
        return allowedTransitions.getOrDefault(current, List.of()).contains(next);
    }    

    // Obtiene los próximos estados válidos desde el estado actual
    public static List<ProcessStatus> getNextAllowedStates(ProcessStatus current){
        return allowedTransitions.getOrDefault(current, List.of());
    }
}
