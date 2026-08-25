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

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "resume_analyses")
public class ResumeAnalysis {
    @Id
    private String id;
    
    private String userId;
    private int matchScore; // 0-100
    private String targetRole;
    
    private List<String> matchedKeywords;
    private List<String> missingKeywords;
    private List<String> suggestions;
    
    @CreatedDate
    private LocalDateTime createdAt;
}

