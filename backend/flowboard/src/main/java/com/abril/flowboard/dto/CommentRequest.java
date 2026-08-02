package com.abril.flowboard.dto;
import jakarta.validation.constraints.NotBlank;

public record CommentRequest(@NotBlank String content) {
    
}
