package com.interviewcopilot.dto.mock;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MockAnswerRequest {
    @NotBlank
    private String answer;
}

