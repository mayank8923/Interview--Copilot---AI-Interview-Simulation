package com.interviewcopilot.dto.chat;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChatMessageRequest {
    @NotBlank(message = "Message content is required")
    private String content;
}

