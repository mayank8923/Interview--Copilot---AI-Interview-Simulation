package com.interviewcopilot.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "questions")
public class Question {
    @Id
    private String id;
    
    private String title;
    private String content;
    private String type; // e.g., TECHNICAL, HR, SYSTEM_DESIGN
    private String difficulty; // EASY, MEDIUM, HARD
    private String targetCompany; // e.g., Google, Amazon, General
    private String topic; // e.g., Arrays, Trees, System Design, Leadership
    private boolean aiGenerated;
    private List<String> tags;
}

