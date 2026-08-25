package com.interviewcopilot.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiEvaluationResponse {
    private int score;
    private List<String> strengths;
    private List<String> weaknesses;
    private String feedback;
    private String timeComplexity;
    private String spaceComplexity;
}

