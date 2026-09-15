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
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey.trim();

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                ),
                "generationConfig", Map.of(
                        "temperature", 0.9,
                        "responseMimeType", "application/json"
                )
        );

        log.info("Sending request to Google Gemini API (gemini-1.5-flash)...");

        String response = webClientBuilder.build()
                .post()
                .uri(url)
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
}

