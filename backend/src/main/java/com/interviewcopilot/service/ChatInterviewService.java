package com.interviewcopilot.service;

import com.interviewcopilot.common.exception.ResourceNotFoundException;
import com.interviewcopilot.model.ChatInterviewSession;
import com.interviewcopilot.model.ChatMessage;
import com.interviewcopilot.repository.ChatInterviewSessionRepository;
import com.interviewcopilot.service.ai.AiEvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ChatInterviewService {

    private final ChatInterviewSessionRepository sessionRepository;
    private final AiEvaluationService aiEvaluationService;

    public Mono<ChatInterviewSession> startSession(String userId, String topic) {
        ChatInterviewSession session = ChatInterviewSession.builder()
                .userId(userId)
                .status("IN_PROGRESS")
                .topic(topic)
                .build();
                
        // Save initially to get ID
        ChatInterviewSession savedSession = sessionRepository.save(session);
        
        // Get initial AI response
        return aiEvaluationService.getChatResponse(savedSession.getMessages(), topic)
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
        
        return aiEvaluationService.getChatResponse(session.getMessages(), session.getTopic())
                .map(aiText -> {
                    ChatMessage aiMessage = ChatMessage.builder()
                            .role("AI")
                            .content(aiText)
                            .timestamp(LocalDateTime.now())
                            .build();
                    session.getMessages().add(aiMessage);
                    return sessionRepository.save(session);
                });
    }
    
    public ChatInterviewSession getSession(String sessionId) {
        return sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("ChatInterviewSession", "id", sessionId));
    }
}

