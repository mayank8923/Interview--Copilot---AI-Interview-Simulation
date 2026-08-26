package com.interviewcopilot.controller;

import com.interviewcopilot.common.api.ApiResponse;
import com.interviewcopilot.model.Question;
import com.interviewcopilot.service.QuestionGenerationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/questions")
@RequiredArgsConstructor
public class QuestionGenerationController {

    private final QuestionGenerationService questionGenerationService;

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<List<Question>>> generateQuestions(
            @RequestParam(defaultValue = "General") String company,
            @RequestParam(defaultValue = "TECHNICAL") String type,
            @RequestParam(defaultValue = "MEDIUM") String difficulty) {

        List<Question> questions = questionGenerationService.generateQuestions(company, type, difficulty);
        return ResponseEntity.ok(ApiResponse.ok("Generated " + questions.size() + " new questions", questions));
    }

    @PostMapping("/generate/bulk")
    public ResponseEntity<ApiResponse<Integer>> bulkGenerate() {
        int total = questionGenerationService.bulkGenerateAll();
        return ResponseEntity.ok(ApiResponse.ok("Bulk generation complete", total));
    }
}

