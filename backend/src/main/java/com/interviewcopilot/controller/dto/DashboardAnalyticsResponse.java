package com.interviewcopilot.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardAnalyticsResponse {
    private int readinessScore;    // Overall out of 100
    private int avgMockScore;      // 0-100
    private int avgPracticeScore;  // 0-100
    private int latestResumeScore; // 0-100
    
    // Additional metrics for UI
    private int totalMockSessions;
    private int totalPracticeQuestions;
}

