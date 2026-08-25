package com.interviewcopilot.controller;

import com.interviewcopilot.common.api.ApiResponse;
import com.interviewcopilot.model.Question;
import com.interviewcopilot.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Question>>> getQuestions(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String difficulty) {
        
        List<Question> questions = questionService.getAllQuestions(type, difficulty);
        return ResponseEntity.ok(ApiResponse.ok(questions));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Question>> getQuestionById(@PathVariable String id) {
        Question question = questionService.getQuestionById(id);
        return ResponseEntity.ok(ApiResponse.ok(question));
    }
}

