package com.interviewcopilot.dto.mock;

import com.interviewcopilot.model.Question;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MockSessionResponse {
    private String sessionId;
    private String status;
    private int currentQuestionIndex;
    private int totalQuestions;
    private Question currentQuestion;
}

