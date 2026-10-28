package com.interviewcopilot.controller;

import com.interviewcopilot.common.api.ApiResponse;
import com.interviewcopilot.dto.ai.AiEvaluationResponse;
import com.interviewcopilot.dto.practice.PracticeSubmitRequest;
import com.interviewcopilot.model.Question;
import com.interviewcopilot.security.CustomUserDetails;
import com.interviewcopilot.service.QuestionService;
import com.interviewcopilot.service.UserActivityService;
import com.interviewcopilot.service.ai.AiEvaluationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/practice")
@RequiredArgsConstructor
public class PracticeController {

    private final QuestionService questionService;
    private final AiEvaluationService aiEvaluationService;
    private final UserActivityService userActivityService;

    @PostMapping("/submit")
    public Mono<ResponseEntity<ApiResponse<AiEvaluationResponse>>> submitAnswer(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody PracticeSubmitRequest request) {
        
        Question question = questionService.getQuestionById(request.getQuestionId());
        
        if (userDetails != null) {
            userActivityService.recordActivity(userDetails.getId());
        }
        
        return aiEvaluationService.evaluateAnswer(question, request.getAnswerText())
                .map(evaluation -> ResponseEntity.ok(ApiResponse.ok(evaluation)));
    }
}

