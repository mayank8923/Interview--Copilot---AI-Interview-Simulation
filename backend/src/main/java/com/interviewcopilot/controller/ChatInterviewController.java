package com.interviewcopilot.controller;

import com.interviewcopilot.common.api.ApiResponse;
import com.interviewcopilot.dto.chat.ChatMessageRequest;
import com.interviewcopilot.dto.chat.StartChatRequest;
import com.interviewcopilot.model.ChatInterviewSession;
import com.interviewcopilot.service.ChatInterviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/chat-interview")
@RequiredArgsConstructor
public class ChatInterviewController {

    private final ChatInterviewService chatInterviewService;

    @PostMapping("/start")
    public ResponseEntity<ApiResponse<ChatInterviewSession>> startChat(
            Authentication authentication,
            @Valid @RequestBody StartChatRequest request) {
        com.interviewcopilot.security.CustomUserDetails userDetails = (com.interviewcopilot.security.CustomUserDetails) authentication.getPrincipal();
        ChatInterviewSession session = chatInterviewService.startSession(userDetails.getId(), request.getTopic()).block();
        return ResponseEntity.ok(ApiResponse.ok(session));
    }

    @PostMapping("/{id}/message")
    public ResponseEntity<ApiResponse<ChatInterviewSession>> sendMessage(
            @PathVariable String id,
            @Valid @RequestBody ChatMessageRequest request) {
        ChatInterviewSession session = chatInterviewService.sendMessage(id, request.getContent()).block();
        return ResponseEntity.ok(ApiResponse.ok(session));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ChatInterviewSession>> getSession(@PathVariable String id) {
        ChatInterviewSession session = chatInterviewService.getSession(id);
        return ResponseEntity.ok(ApiResponse.ok(session));
    }
}

