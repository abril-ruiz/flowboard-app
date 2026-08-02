package com.abril.flowboard.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ProfileUpdateRequest(@NotBlank String username, @NotBlank @Email String email) {}
