package com.interviewcopilot.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";

    private String preferredLanguage;

    // Profiling fields
    private String educationLevel;
    private String experienceLevel;
    private Integer yearsOfExperience;
    private String currentYear;
    private String branch;
    
    public AuthResponse(String token) {
        this.token = token;
    }
}
