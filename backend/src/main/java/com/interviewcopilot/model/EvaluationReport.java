package com.interviewcopilot.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "evaluation_reports")
public class EvaluationReport {
    @Id
    private String id;
    
    private String sessionId;
    private String userId;
    private int overallScore;
    
    // e.g., "Technical": 85, "Communication": 90, "Problem Solving": 75
    private Map<String, Integer> radarMetrics;
    
    private List<String> aggregateStrengths;
    private List<String> aggregateWeaknesses;
    
    private String feedback;
    
    @CreatedDate
    private LocalDateTime createdAt;
}

