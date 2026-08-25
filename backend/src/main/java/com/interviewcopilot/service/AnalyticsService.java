package com.interviewcopilot.service;

import com.interviewcopilot.controller.dto.DashboardAnalyticsResponse;
import com.interviewcopilot.model.MockInterviewSession;
import com.interviewcopilot.model.ResumeAnalysis;
import com.interviewcopilot.repository.MockInterviewRepository;
import com.interviewcopilot.repository.ResumeAnalysisRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsService {

    private final MockInterviewRepository mockInterviewRepository;
    private final ResumeAnalysisRepository resumeAnalysisRepository;

    public DashboardAnalyticsResponse getUserAnalytics(String userId) {
        
        // 1. Fetch latest Resume Analysis
        Optional<ResumeAnalysis> latestResume = resumeAnalysisRepository.findTopByUserIdOrderByCreatedAtDesc(userId);
        int resumeScore = latestResume.map(ResumeAnalysis::getMatchScore).orElse(0);

        // 2. Fetch completed mock interviews
        List<MockInterviewSession> completedMocks = mockInterviewRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .filter(session -> session.getStatus() == MockInterviewSession.SessionStatus.COMPLETED && session.getOverallScore() > 0)
                .toList();

        int totalMocks = completedMocks.size();
        int avgMock = totalMocks > 0 ? (int) completedMocks.stream().mapToInt(MockInterviewSession::getOverallScore).average().orElse(0) : 0;

        // 3. Mock practice score (until we build a full Practice DB model for submissions)
        // For now, we will simulate the practice score to ensure the dashboard works seamlessly
        int avgPractice = totalMocks > 0 ? Math.min(100, avgMock + 10) : 0; 
        int totalPractice = totalMocks * 3;

        // Calculate Readiness Score: (0.45 * Avg Mock) + (0.35 * Avg Practice) + (0.20 * Resume Match)
        double readiness = (0.45 * avgMock) + (0.35 * avgPractice) + (0.20 * resumeScore);

        return DashboardAnalyticsResponse.builder()
                .readinessScore((int) Math.round(readiness))
                .avgMockScore(avgMock)
                .avgPracticeScore(avgPractice)
                .latestResumeScore(resumeScore)
                .totalMockSessions(totalMocks)
                .totalPracticeQuestions(totalPractice)
                .build();
    }
}

