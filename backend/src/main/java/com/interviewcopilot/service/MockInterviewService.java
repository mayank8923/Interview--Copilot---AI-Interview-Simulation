package com.interviewcopilot.service;

import com.interviewcopilot.common.exception.ResourceNotFoundException;
import com.interviewcopilot.common.exception.BadRequestException;
import com.interviewcopilot.dto.mock.MockSessionResponse;
import com.interviewcopilot.dto.mock.StartMockRequest;
import com.interviewcopilot.model.EvaluationReport;
import com.interviewcopilot.model.MockInterviewSession;
import com.interviewcopilot.model.Question;
import com.interviewcopilot.repository.EvaluationReportRepository;
import com.interviewcopilot.repository.MockInterviewSessionRepository;
import com.interviewcopilot.repository.QuestionRepository;
import com.interviewcopilot.service.ai.AiEvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MockInterviewService {

    private final MockInterviewSessionRepository sessionRepository;
    private final EvaluationReportRepository reportRepository;
    private final QuestionRepository questionRepository;
    private final AiEvaluationService aiEvaluationService;

    public MockSessionResponse startSession(String userId, StartMockRequest request) {
        List<Question> allQuestions = questionRepository.findAll();
        Collections.shuffle(allQuestions);
        
        int numQuestions = request.getDurationMinutes() == 15 ? 2 : 3;
        List<Question> selectedQuestions = allQuestions.stream().limit(numQuestions).collect(Collectors.toList());
        
        MockInterviewSession session = MockInterviewSession.builder()
                .userId(userId)
                .status("IN_PROGRESS")
                .questions(selectedQuestions)
                .userAnswers(new ArrayList<>())
                .build();
                
        session = sessionRepository.save(session);
        
        return MockSessionResponse.builder()
                .sessionId(session.getId())
                .status(session.getStatus())
                .currentQuestionIndex(0)
                .totalQuestions(session.getQuestions().size())
                .currentQuestion(session.getQuestions().get(0))
                .build();
    }
    
    public MockSessionResponse getSession(String sessionId) {
        MockInterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("MockSession", "id", sessionId));
                
        int index = session.getUserAnswers().size();
        Question currentQ = index < session.getQuestions().size() ? session.getQuestions().get(index) : null;
        
        return MockSessionResponse.builder()
                .sessionId(session.getId())
                .status(session.getStatus())
                .currentQuestionIndex(index)
                .totalQuestions(session.getQuestions().size())
                .currentQuestion(currentQ)
                .build();
    }

    public MockSessionResponse submitAnswer(String sessionId, String answer) {
        MockInterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("MockSession", "id", sessionId));
                
        if ("COMPLETED".equals(session.getStatus())) {
            throw new BadRequestException("Session is already completed.");
        }
        
        session.getUserAnswers().add(answer);
        session = sessionRepository.save(session);
        
        return getSession(sessionId);
    }

    public Mono<EvaluationReport> finishSession(String sessionId) {
        MockInterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("MockSession", "id", sessionId));
                
        if ("COMPLETED".equals(session.getStatus())) {
            return Mono.just(reportRepository.findBySessionId(sessionId).orElseThrow());
        }
        
        session.setStatus("COMPLETED");
        session.setCompletedAt(LocalDateTime.now());
        sessionRepository.save(session);
        
        return aiEvaluationService.generateAggregateReport(session)
                .map(report -> reportRepository.save(report));
    }
    
    public EvaluationReport getReport(String sessionId) {
        return reportRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("EvaluationReport", "sessionId", sessionId));
    }
}

