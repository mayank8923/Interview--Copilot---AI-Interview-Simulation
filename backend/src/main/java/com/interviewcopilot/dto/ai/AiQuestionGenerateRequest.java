package com.interviewcopilot.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiQuestionGenerateRequest {
    private String role;           // e.g. "Backend Engineer", "Fullstack Developer", "DevOps Engineer"
    private String company;        // e.g. "Google", "Amazon", "General"
    private String topic;          // e.g. "Spring Boot", "React", "Kubernetes", "System Design"
    private String difficulty;     // "EASY", "MEDIUM", "HARD"
    private String type;           // "TECHNICAL", "SYSTEM_DESIGN", "HR"
    private Integer count;         // Number of questions (default 3, max 5)
    private String customPrompt;   // Optional custom JD or topic description
}

