package com.credicorp.devpanel.dto;

import com.credicorp.devpanel.entity.User;

import java.time.OffsetDateTime;
import java.util.UUID;

public record UserDTO(
        UUID id,
        String fullName,
        String email,
        String role,
        String status,
        OffsetDateTime createdAt
) {
    public static UserDTO from(User u) {
        return new UserDTO(
                u.getId(),
                u.getFullName(),
                u.getEmail(),
                u.getRole().name(),
                u.getStatus().name(),
                u.getCreatedAt()
        );
    }
}
