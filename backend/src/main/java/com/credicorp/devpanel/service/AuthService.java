package com.credicorp.devpanel.service;

import com.credicorp.devpanel.dto.LoginRequest;
import com.credicorp.devpanel.dto.LoginResponse;
import com.credicorp.devpanel.dto.UserDTO;
import com.credicorp.devpanel.entity.User;
import com.credicorp.devpanel.exception.InvalidCredentialsException;
import com.credicorp.devpanel.repository.UserRepository;
import com.credicorp.devpanel.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new InvalidCredentialsException("Email o password incorrectos"));

        if (user.getStatus() != User.Status.ACTIVE) {
            throw new InvalidCredentialsException("Usuario inactivo");
        }

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Email o password incorrectos");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return new LoginResponse(token, jwtUtil.getExpirationSeconds(), UserDTO.from(user));
    }
}
