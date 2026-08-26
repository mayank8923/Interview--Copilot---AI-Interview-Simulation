package com.interviewcopilot.controller;

import com.interviewcopilot.model.User;
import com.interviewcopilot.repository.UserRepository;
import com.interviewcopilot.security.JwtTokenProvider;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AnalyticsControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private String validToken;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        User testUser = User.builder()
                .email("test@example.com")
                .passwordHash(passwordEncoder.encode("password123"))
                .name("Test User")
                .role(User.Role.USER)
                .build();
                
        userRepository.save(testUser);

        validToken = jwtTokenProvider.generateTokenFromUserId(testUser.getId(), testUser.getEmail());
    }

    @AfterEach
    void tearDown() {
        userRepository.deleteAll();
    }

    @Test
    void getDashboardAnalytics_WhenUnauthenticated_ReturnsForbidden() throws Exception {
        mockMvc.perform(get("/api/v1/analytics/dashboard"))
                .andExpect(status().isForbidden());
    }

    @Test
    void getDashboardAnalytics_WhenAuthenticated_ReturnsAnalytics() throws Exception {
        mockMvc.perform(get("/api/v1/analytics/dashboard")
                .header("Authorization", "Bearer " + validToken)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.readinessScore").isNumber());
    }
}

