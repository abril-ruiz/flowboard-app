package com.abril.flowboard.dto;
import com.abril.flowboard.enums.ProcessStatus;
import jakarta.validation.constraints.NotNull;

public record StatusUpdateRequest(@NotNull ProcessStatus newStatus, String comment) {}
