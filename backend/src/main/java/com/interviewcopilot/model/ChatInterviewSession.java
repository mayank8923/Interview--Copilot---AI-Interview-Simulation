package com.interviewcopilot.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "chat_interview_sessions")
public class ChatInterviewSession {
    @Id
    private String id;
    
    private String userId;
    private String status; // IN_PROGRESS, COMPLETED
    private String topic;
    
    @Builder.Default
    private List<ChatMessage> messages = new ArrayList<>();
    
    @CreatedDate
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}

