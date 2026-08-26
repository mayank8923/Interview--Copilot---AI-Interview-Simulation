package com.interviewcopilot.dto.chat;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StartChatRequest {
    @NotBlank(message = "Topic is required")
    private String topic;
}

