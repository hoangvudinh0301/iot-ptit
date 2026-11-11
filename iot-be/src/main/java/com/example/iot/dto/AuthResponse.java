package com.example.iot.dto;

public record AuthResponse(
    String accessToken,
    String tokenType,
    long expiresIn
) {}
