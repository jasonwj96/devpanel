package com.credicorp.devpanel.controller;

import com.credicorp.devpanel.dto.DashboardMetricsDTO;
import com.credicorp.devpanel.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final UserService userService;

    public DashboardController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/metrics")
    public ResponseEntity<DashboardMetricsDTO> metrics() {
        return ResponseEntity.ok(userService.metrics());
    }
}
