package com.abril.flowboard.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProcessRequest(
        @NotBlank(message = "El nombre del proceso es obligatorio")
        @Size(max = 100, message = "El nombre del proceso no puede tener más de 100 caracteres")
        String title,

        @Size(max = 1000, message = "La descripción del proceso no puede tener más de 1000 caracteres")
        String description
) {}
