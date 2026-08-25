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
@Document(collection = "mock_interview_sessions")
public class MockInterviewSession {
    @Id
    private String id;
    
    private String userId;
    private String status; // IN_PROGRESS, COMPLETED
    
    private List<Question> questions;
    private List<String> userAnswers;
    
    @CreatedDate
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}

