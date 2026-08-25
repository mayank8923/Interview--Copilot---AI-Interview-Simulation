package com.interviewcopilot.controller;

import com.interviewcopilot.common.api.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkHealth() {
        Map<String, Object> healthInfo = new HashMap<>();
        healthInfo.put("status", "UP");
        healthInfo.put("service", "Interview Copilot Backend API");
        healthInfo.put("version", "1.0.0-MVP");
        healthInfo.put("environment", System.getProperty("spring.profiles.active", "dev"));
        healthInfo.put("serverTime", Instant.now().toString());

        return ResponseEntity.ok(ApiResponse.ok("Service is running smoothly", healthInfo));
    }
}

