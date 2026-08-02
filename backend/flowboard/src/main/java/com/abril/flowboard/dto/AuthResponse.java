package com.abril.flowboard.dto;

public record AuthResponse(String token, String role, String username, String email) {}
