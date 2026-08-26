package com.interviewcopilot.service.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewcopilot.dto.ai.AiEvaluationResponse;
import com.interviewcopilot.model.Question;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiEvaluationService {

    @Value("${ai.provider.key:}")
    private String apiKey;

    private final ObjectMapper objectMapper;

    /**
     * Evaluates the user's answer against the given question.
     * Uses a mock response if no API key is provided to ensure local development works smoothly.
     */
    public Mono<AiEvaluationResponse> evaluateAnswer(Question question, String userAnswer) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            log.info("No AI API key found. Using mock AI evaluation.");
            return getMockEvaluation(question, userAnswer);
        }

        // TODO: Implement actual WebClient call to Gemini/OpenAI API here.
        // For now, if an API key is provided but the WebClient isn't wired up, we fallback to mock anyway.
        log.warn("Actual AI provider call not fully implemented yet, falling back to mock.");
        return getMockEvaluation(question, userAnswer);
    }

    private Mono<AiEvaluationResponse> getMockEvaluation(Question question, String userAnswer) {
        Random rand = new Random();
        int score = userAnswer.length() > 20 ? 80 + rand.nextInt(20) : 40 + rand.nextInt(30);

        List<String> strengths = Arrays.asList(
                "Attempted to solve the core problem.",
                "Syntax looks generally readable."
        );

        List<String> weaknesses = Arrays.asList(
                "Did not handle edge cases like null or empty inputs.",
                "Variable naming could be more descriptive."
        );

        String feedback = score > 75 
                ? "Good job! This is a solid approach, but remember to consider edge cases." 
                : "This needs more work. Think about the constraints and try a different algorithmic approach.";

        String tc = question.getType().equals("TECHNICAL") ? "O(N^2) or worse" : "N/A";
        String sc = question.getType().equals("TECHNICAL") ? "O(1)" : "N/A";

        AiEvaluationResponse response = AiEvaluationResponse.builder()
                .score(score)
                .strengths(strengths)
                .weaknesses(weaknesses)
                .feedback(feedback)
                .timeComplexity(tc)
                .spaceComplexity(sc)
                .build();

        return Mono.just(response);
    }

    public Mono<com.interviewcopilot.model.EvaluationReport> generateAggregateReport(com.interviewcopilot.model.MockInterviewSession session) {
        Random rand = new Random();
        
        java.util.Map<String, Integer> metrics = new java.util.HashMap<>();
        metrics.put("Technical", 60 + rand.nextInt(40));
        metrics.put("Communication", 60 + rand.nextInt(40));
        metrics.put("Problem Solving", 60 + rand.nextInt(40));
        metrics.put("Completeness", 60 + rand.nextInt(40));
        metrics.put("Efficiency", 60 + rand.nextInt(40));

        int overall = metrics.values().stream().mapToInt(Integer::intValue).sum() / 5;

        com.interviewcopilot.model.EvaluationReport report = com.interviewcopilot.model.EvaluationReport.builder()
                .sessionId(session.getId())
                .userId(session.getUserId())
                .overallScore(overall)
                .radarMetrics(metrics)
                .aggregateStrengths(Arrays.asList("Good problem solving intuition", "Clear communication style"))
                .aggregateWeaknesses(Arrays.asList("Missed edge cases", "Needs more optimal algorithms"))
                .feedback("Overall a solid interview. You did well on communication, but you need to focus on optimizing your code.")
                .build();

        return Mono.just(report);
    }

    public Mono<com.interviewcopilot.model.ResumeAnalysis> analyzeResume(String userId, String targetRole, String resumeText) {
        // Mocking AI response for resume parsing
        Random rand = new Random();
        int score = 40 + rand.nextInt(50); // 40 to 90

        com.interviewcopilot.model.ResumeAnalysis analysis = com.interviewcopilot.model.ResumeAnalysis.builder()
                .userId(userId)
                .targetRole(targetRole != null ? targetRole : "Software Engineer")
                .matchScore(score)
                .matchedKeywords(Arrays.asList("Java", "Spring Boot", "React", "REST API", "MongoDB"))
                .missingKeywords(Arrays.asList("Docker", "AWS", "CI/CD Pipeline", "Kubernetes"))
                .suggestions(Arrays.asList(
                        "Add metrics to your experience bullets (e.g. 'Improved latency by 20%').",
                        "Include more DevOps keywords like Docker and CI/CD if applying for Full Stack roles.",
                        "Highlight system design architecture in your recent projects."
                ))
                .build();

        return Mono.just(analysis);
    }

    public Mono<String> getChatResponse(List<com.interviewcopilot.model.ChatMessage> history, String topic) {
        // Mock AI chat logic
        if (history.isEmpty()) {
            return Mono.just("Hello! I will be your interviewer today. We'll be focusing on " + topic + ". Are you ready to begin with the first question?");
        }
        
        int turnCount = history.size();
        
        if (turnCount == 2) {
            if (topic.toLowerCase().contains("design") || topic.toLowerCase().contains("system")) {
                return Mono.just("Great. Let's start with a system design question. How would you design a distributed rate limiter? Please outline the high-level architecture.");
            } else if (topic.toLowerCase().contains("behavioral") || topic.toLowerCase().contains("hr")) {
                return Mono.just("Excellent. Tell me about a time you had a major disagreement with a team member. How did you resolve it?");
            } else {
                return Mono.just("Awesome. Let's start with a coding problem. Given an array of integers, how would you find the longest increasing subsequence in O(n log n) time?");
            }
        }
        
        if (turnCount == 4) {
            return Mono.just("That's an interesting approach. Can you explain the trade-offs of your solution? Specifically, what are the time and space complexities?");
        }
        
        if (turnCount == 6) {
            return Mono.just("I see. What if we scale this up? Suppose the input size is 100x larger, or we have 10,000 concurrent requests. How would your system handle that?");
        }
        
        if (turnCount >= 8) {
            return Mono.just("That makes sense. We're almost out of time. Do you have any questions for me about the company or the team?");
        }

        return Mono.just("Could you elaborate a bit more on that last point? I want to make sure I understand your reasoning.");
    }
}

