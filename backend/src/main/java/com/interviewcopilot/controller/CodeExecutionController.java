package com.interviewcopilot.controller;

import com.interviewcopilot.dto.CodeExecutionRequest;
import com.interviewcopilot.service.ai.LlmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/code")
@CrossOrigin(origins = "*") // Adjust if you have a specific CORS configuration
public class CodeExecutionController {

    @Autowired
    private LlmService llmService;

    @PostMapping("/execute")
    public Map<String, String> executeCode(@RequestBody CodeExecutionRequest request) {
        // Ask the AI to simulate the code execution using the API key
        String simulatedOutput = llmService.simulateCodeExecution(
                request.getLanguage(), 
                request.getCode(),
                request.getMode()
        );

        Map<String, String> response = new HashMap<>();
        response.put("output", simulatedOutput);
        return response;
    }
}

