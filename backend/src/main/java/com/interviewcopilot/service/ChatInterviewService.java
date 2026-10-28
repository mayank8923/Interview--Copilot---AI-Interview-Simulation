package com.interviewcopilot.service;

import com.interviewcopilot.common.exception.ResourceNotFoundException;
import com.interviewcopilot.model.ChatInterviewSession;
import com.interviewcopilot.model.ChatMessage;
import com.interviewcopilot.model.ResumeAnalysis;
import com.interviewcopilot.repository.ChatInterviewSessionRepository;
import com.interviewcopilot.repository.ResumeAnalysisRepository;
import com.interviewcopilot.service.ai.AiEvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ChatInterviewService {

    private final ChatInterviewSessionRepository sessionRepository;
    private final ResumeAnalysisRepository resumeAnalysisRepository;
    private final AiEvaluationService aiEvaluationService;
    private final UserActivityService userActivityService;

    public Mono<ChatInterviewSession> startSession(String userId, String topic) {
        return startSession(userId, topic, "FAANG Bar Raiser", false);
    }

    public Mono<ChatInterviewSession> startSession(String userId, String topic, String persona) {
        return startSession(userId, topic, persona, false);
    }

    public Mono<ChatInterviewSession> startSession(String userId, String topic, String persona, boolean useResume) {
        String chosenPersona = persona != null && !persona.trim().isEmpty() ? persona : "FAANG Bar Raiser";
        
        String resumeText = null;
        boolean isTailored = false;
        if (useResume) {
            ResumeAnalysis latest = resumeAnalysisRepository.findTopByUserIdOrderByCreatedAtDesc(userId).orElse(null);
            if (latest != null && latest.getRawResumeText() != null && !latest.getRawResumeText().trim().isEmpty()) {
                resumeText = latest.getRawResumeText();
                isTailored = true;
            }
        }

        ChatInterviewSession session = ChatInterviewSession.builder()
                .userId(userId)
                .status("IN_PROGRESS")
                .topic(topic)
                .persona(chosenPersona)
                .resumeTailored(isTailored)
                .build();
                
        // Save initially to get ID
        ChatInterviewSession savedSession = sessionRepository.save(session);
        
        final String finalResumeText = resumeText;
        // Get initial AI response
        return aiEvaluationService.getChatResponse(savedSession.getMessages(), topic, chosenPersona, finalResumeText)
                .map(aiText -> {
                    ChatMessage aiMessage = ChatMessage.builder()
                            .role("AI")
                            .content(aiText)
                            .timestamp(LocalDateTime.now())
                            .build();
                    savedSession.getMessages().add(aiMessage);
                    return sessionRepository.save(savedSession);
                });
    }

    public Mono<ChatInterviewSession> sendMessage(String sessionId, String content) {
        ChatInterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("ChatInterviewSession", "id", sessionId));
                
        ChatMessage userMessage = ChatMessage.builder()
                .role("USER")
                .content(content)
                .timestamp(LocalDateTime.now())
                .build();
        
        session.getMessages().add(userMessage);

        String resumeText = null;
        if (session.isResumeTailored()) {
            ResumeAnalysis latest = resumeAnalysisRepository.findTopByUserIdOrderByCreatedAtDesc(session.getUserId()).orElse(null);
            if (latest != null && latest.getRawResumeText() != null) {
                resumeText = latest.getRawResumeText();
            }
        }
        
        return aiEvaluationService.getChatResponse(session.getMessages(), session.getTopic(), session.getPersona(), resumeText)
                .map(aiText -> {
                    ChatMessage aiMessage = ChatMessage.builder()
                            .role("AI")
                            .content(aiText)
                            .timestamp(LocalDateTime.now())
                            .build();
                    session.getMessages().add(aiMessage);
                    ChatInterviewSession saved = sessionRepository.save(session);
                    userActivityService.recordActivity(session.getUserId());
                    return saved;
                });
    }

    public Mono<ChatInterviewSession> concludeSession(String sessionId) {
        ChatInterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("ChatInterviewSession", "id", sessionId));

        session.setStatus("COMPLETED");
        session.setCompletedAt(LocalDateTime.now());

        return aiEvaluationService.evaluateChatSession(session)
                .map(evaluation -> {
                    session.setFeedback(evaluation);
                    ChatInterviewSession saved = sessionRepository.save(session);
                    userActivityService.recordActivity(session.getUserId());
                    return saved;
                });
    }
    
    public ChatInterviewSession getSession(String sessionId) {
        return sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("ChatInterviewSession", "id", sessionId));
    }
}

