package com.interviewcopilot.service.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class LlmService {

    @Value("${app.ai.api-key:${AI_API_KEY:}}")
    private String apiKey;

    @Value("${app.ai.provider:${AI_PROVIDER:gemini}}")
    private String provider;

    private final ObjectMapper objectMapper;
    private final WebClient.Builder webClientBuilder = WebClient.builder();

    /**
     * Calls the configured AI Provider (Gemini or OpenAI) to generate structured text/JSON.
     */
    public String generate(String prompt) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            log.warn("No AI API key found (AI_API_KEY is blank). Unable to make live LLM call.");
            return null;
        }

        try {
            if ("gemini".equalsIgnoreCase(provider) || !apiKey.startsWith("sk-")) {
                return callGemini(prompt);
            } else {
                return callOpenAi(prompt);
            }
        } catch (Exception e) {
            log.error("Live AI call failed: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Calls Google Gemini 1.5 Flash API with JSON mode enabled.
     */
    private String callGemini(String prompt) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent";

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                ),
                "generationConfig", Map.of(
                        "temperature", 0.7,
                        "responseMimeType", "application/json"
                )
        );

        log.info("Sending request to Google Gemini API (gemini-flash-lite-latest)...");

        String response = webClientBuilder.build()
                .post()
                .uri(url)
                .header("x-goog-api-key", apiKey.trim())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofSeconds(25))
                .block();

        try {
            JsonNode root = objectMapper.readTree(response);
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && !candidates.isEmpty()) {
                JsonNode parts = candidates.get(0).path("content").path("parts");
                if (parts.isArray() && !parts.isEmpty()) {
                    String generatedText = parts.get(0).path("text").asText();
                    log.info("Successfully received response from Gemini API (length: {} chars)", generatedText.length());
                    return generatedText;
                }
            }
        } catch (Exception e) {
            log.error("Error parsing Gemini API JSON response", e);
        }

        return response;
    }

    /**
     * Calls OpenAI Chat Completions API.
     */
    private String callOpenAi(String prompt) {
        String url = "https://api.openai.com/v1/chat/completions";

        Map<String, Object> requestBody = Map.of(
                "model", "gpt-4o-mini",
                "messages", List.of(
                        Map.of("role", "system", "content", "You are an expert FAANG technical interviewer. Return strictly a JSON array."),
                        Map.of("role", "user", "content", prompt)
                ),
                "temperature", 0.9
        );

        log.info("Sending request to OpenAI API (gpt-4o-mini)...");

        String response = webClientBuilder.build()
                .post()
                .uri(url)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey.trim())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofSeconds(25))
                .block();

        try {
            JsonNode root = objectMapper.readTree(response);
            JsonNode choices = root.path("choices");
            if (choices.isArray() && !choices.isEmpty()) {
                return choices.get(0).path("message").path("content").asText();
            }
        } catch (Exception e) {
            log.error("Error parsing OpenAI response", e);
        }

        return response;
    }

    /**
     * Simulates code execution by asking the LLM for plain text standard output.
     */
    public String simulateCodeExecution(String language, String code) {
        return simulateCodeExecution(language, code, "run");
    }

    public String simulateCodeExecution(String language, String code, String mode) {
        if (apiKey == null || apiKey.trim().isEmpty() || apiKey.contains("your_openai_or_gemini_api_key_here")) {
            return "Mock Output: Hello, World!\n\n[Note: This is a mocked response because your AI_API_KEY is missing or still set to the placeholder in your .env file. Please add a valid Gemini or OpenAI key to get real code simulation!]";
        }

        boolean isSubmit = "submit".equalsIgnoreCase(mode);

        String prompt;
        if (!isSubmit) {
            // RUN MODE: Test ONLY visible sample testcases
            prompt = String.format(
                    "You are an ultra-fast code execution engine simulating a LeetCode environment for %s code. " +
                    "Evaluate the code against ONLY the 2 visible sample test cases. Do NOT check or output hidden test cases. Output ONLY in this exact format:\n\n" +
                    "Test Case 1:\n" +
                    "Input: ...\n" +
                    "Output: ...\n" +
                    "Expected: ... | Status: Passed/Failed\n\n" +
                    "Test Case 2:\n" +
                    "Input: ...\n" +
                    "Output: ...\n" +
                    "Expected: ... | Status: Passed/Failed\n\n" +
                    "Code:\n%s",
                    language, code
            );
        } else {
            // SUBMIT MODE: Full evaluation against Sample + 100 Hidden Testcases
            prompt = String.format(
                    "You are a strict, full LeetCode code submission judge for %s code. " +
                    "Evaluate the code against the 2 visible sample test cases AND 100 comprehensive hidden test cases (including edge cases: negatives, zero, large arrays, limits). Output ONLY in this exact format:\n\n" +
                    "Test Case 1:\n" +
                    "Input: ...\n" +
                    "Output: ...\n" +
                    "Expected: ... | Status: Passed/Failed\n\n" +
                    "Test Case 2:\n" +
                    "Input: ...\n" +
                    "Output: ...\n" +
                    "Expected: ... | Status: Passed/Failed\n\n" +
                    "Hidden Test Cases: 100/100 Passed\n" +
                    "(If any bug, edge case failure, or syntax error exists, set Status to Failed, or output: Hidden Test Cases: 0/100 Passed\\nFailed on a hidden test case.)\n\n" +
                    "Code:\n%s",
                    language, code
            );
        }

        if (apiKey.trim().startsWith("sk-") || "openai".equalsIgnoreCase(provider)) {
            return callOpenAiPlainText(prompt);
        } else {
            return callGeminiPlainText(prompt);
        }
    }

    /**
     * Calls Google Gemini API without enforcing JSON response format.
     */
    private String callGeminiPlainText(String prompt) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent";

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                ),
                "generationConfig", Map.of(
                        "temperature", 0.0,
                        "maxOutputTokens", 250
                )
        );

        int maxRetries = 3;
        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                String response = webClientBuilder.build()
                        .post()
                        .uri(url)
                        .header("x-goog-api-key", apiKey.trim())
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(requestBody)
                        .retrieve()
                        .bodyToMono(String.class)
                        .timeout(Duration.ofSeconds(25))
                        .block();

                JsonNode root = objectMapper.readTree(response);
                JsonNode candidates = root.path("candidates");
                if (candidates.isArray() && !candidates.isEmpty()) {
                    JsonNode parts = candidates.get(0).path("content").path("parts");
                    if (parts.isArray() && !parts.isEmpty()) {
                        String rawText = parts.get(0).path("text").asText().trim();
                        return stripThoughtBlock(rawText);
                    }
                }
                return "No output generated.";
            } catch (Exception e) {
                if (attempt == maxRetries) {
                    log.error("Error simulating code execution via Gemini", e);
                    String errorDetails = e.getMessage();
                    if (e instanceof org.springframework.web.reactive.function.client.WebClientResponseException) {
                        org.springframework.web.reactive.function.client.WebClientResponseException webEx = (org.springframework.web.reactive.function.client.WebClientResponseException) e;
                        errorDetails += "\nGoogle API Details: " + webEx.getResponseBodyAsString();
                    }
                    return "Execution simulation failed: " + errorDetails;
                }
                log.warn("Attempt {} failed, retrying... ({})", attempt, e.getMessage());
                try {
                    Thread.sleep(1000 * attempt);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
            }
        }

        return "No output generated.";
    }

    /**
     * Calls OpenAI Chat Completions API for plain text.
     */
    private String callOpenAiPlainText(String prompt) {
        String url = "https://api.openai.com/v1/chat/completions";

        Map<String, Object> requestBody = Map.of(
                "model", "gpt-4o-mini",
                "messages", List.of(
                        Map.of("role", "system", "content", "You are a code execution engine. Return ONLY the standard output or error. No explanations. No markdown."),
                        Map.of("role", "user", "content", prompt)
                ),
                "temperature", 0.1
        );

        try {
            String response = webClientBuilder.build()
                    .post()
                    .uri(url)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey.trim())
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(25))
                    .block();

            JsonNode root = objectMapper.readTree(response);
            JsonNode choices = root.path("choices");
            if (choices.isArray() && !choices.isEmpty()) {
                String rawText = choices.get(0).path("message").path("content").asText().trim();
                return stripThoughtBlock(rawText);
            }
        } catch (Exception e) {
            log.error("Error simulating code execution via OpenAI", e);
            return "Execution simulation failed: " + e.getMessage();
        }

        return "No output generated.";
    }

    private String stripThoughtBlock(String text) {
        if (text == null) return null;
        int endTag = text.lastIndexOf("</thought>");
        if (endTag != -1) {
            return text.substring(endTag + 10).trim();
        }
        return text;
    }
}
