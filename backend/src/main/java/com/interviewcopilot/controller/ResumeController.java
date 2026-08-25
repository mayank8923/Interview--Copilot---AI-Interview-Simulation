package com.interviewcopilot.controller;

import com.interviewcopilot.common.api.ApiResponse;
import com.interviewcopilot.common.exception.BadRequestException;
import com.interviewcopilot.model.ResumeAnalysis;
import com.interviewcopilot.model.User;
import com.interviewcopilot.repository.ResumeAnalysisRepository;
import com.interviewcopilot.repository.UserRepository;
import com.interviewcopilot.security.CustomUserDetails;
import com.interviewcopilot.service.PdfParserService;
import com.interviewcopilot.service.ai.AiEvaluationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/resume")
@RequiredArgsConstructor
@Slf4j
public class ResumeController {

    private final PdfParserService pdfParserService;
    private final AiEvaluationService aiEvaluationService;
    private final ResumeAnalysisRepository resumeAnalysisRepository;
    private final UserRepository userRepository;

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<ResumeAnalysis>> uploadResume(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) {
            
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String userId = userDetails.getId();
        
        if (file.isEmpty()) {
            throw new BadRequestException("Please upload a valid file.");
        }
        
        String filename = file.getOriginalFilename();
        if (filename == null || !filename.toLowerCase().endsWith(".pdf")) {
             throw new BadRequestException("Please upload a valid PDF file.");
        }

        try {
            String extractedText = pdfParserService.extractText(file);
            User user = userRepository.findById(userId).orElseThrow();
            
            ResumeAnalysis analysis = aiEvaluationService.analyzeResume(userId, user.getTargetRole(), extractedText).block();
            ResumeAnalysis saved = resumeAnalysisRepository.save(analysis);
            return ResponseEntity.ok(ApiResponse.ok("Resume analyzed successfully", saved));

        } catch (Exception e) {
            log.error("Failed to parse PDF", e);
            throw new BadRequestException("PDF Parse Error: " + e.getMessage() + " (" + e.getClass().getSimpleName() + ")");
        }
    }

    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<ResumeAnalysis>> getLatestAnalysis(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return resumeAnalysisRepository.findTopByUserIdOrderByCreatedAtDesc(userDetails.getId())
                .map(analysis -> ResponseEntity.ok(ApiResponse.ok(analysis)))
                .orElseGet(() -> ResponseEntity.ok(ApiResponse.ok(null)));
    }
}

