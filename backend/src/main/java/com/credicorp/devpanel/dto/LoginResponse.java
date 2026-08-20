package com.credicorp.devpanel.dto;

public record LoginResponse(
        String token,
        long expiresInSeconds,
        UserDTO user
) {
}
