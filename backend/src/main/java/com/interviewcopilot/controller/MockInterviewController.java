package com.interviewcopilot.controller;

import com.interviewcopilot.common.api.ApiResponse;
import com.interviewcopilot.dto.mock.MockAnswerRequest;
import com.interviewcopilot.dto.mock.MockSessionResponse;
import com.interviewcopilot.dto.mock.StartMockRequest;
import com.interviewcopilot.model.EvaluationReport;
import com.interviewcopilot.service.MockInterviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/mock")
@RequiredArgsConstructor
public class MockInterviewController {

    private final MockInterviewService mockInterviewService;

    @PostMapping("/start")
    public ResponseEntity<ApiResponse<MockSessionResponse>> startMock(
            Authentication authentication,
            @Valid @RequestBody StartMockRequest request) {
        com.interviewcopilot.security.CustomUserDetails userDetails = (com.interviewcopilot.security.CustomUserDetails) authentication.getPrincipal();
        MockSessionResponse response = mockInterviewService.startSession(userDetails.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MockSessionResponse>> getSession(@PathVariable String id) {
        MockSessionResponse response = mockInterviewService.getSession(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/{id}/answer")
    public ResponseEntity<ApiResponse<MockSessionResponse>> submitAnswer(
            @PathVariable String id,
            @Valid @RequestBody MockAnswerRequest request) {
        MockSessionResponse response = mockInterviewService.submitAnswer(id, request.getAnswer());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/{id}/finish")
    public ResponseEntity<ApiResponse<EvaluationReport>> finishSession(@PathVariable String id) {
        EvaluationReport report = mockInterviewService.finishSession(id).block();
        return ResponseEntity.ok(ApiResponse.ok(report));
    }

    @GetMapping("/{id}/report")
    public ResponseEntity<ApiResponse<EvaluationReport>> getReport(@PathVariable String id) {
        EvaluationReport report = mockInterviewService.getReport(id);
        return ResponseEntity.ok(ApiResponse.ok(report));
    }
}

