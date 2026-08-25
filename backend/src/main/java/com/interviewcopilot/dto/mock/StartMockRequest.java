package com.interviewcopilot.dto.mock;

import lombok.Data;

@Data
public class StartMockRequest {
    private String type; // e.g., "TECHNICAL", "HR"
    private int durationMinutes; // e.g., 15 or 30
}

