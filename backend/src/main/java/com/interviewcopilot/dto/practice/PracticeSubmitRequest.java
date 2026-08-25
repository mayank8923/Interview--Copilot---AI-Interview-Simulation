package com.interviewcopilot.dto.practice;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PracticeSubmitRequest {
    @NotBlank(message = "Question ID is required")
    private String questionId;
    
    @NotBlank(message = "Answer cannot be empty")
    private String answerText;
}

