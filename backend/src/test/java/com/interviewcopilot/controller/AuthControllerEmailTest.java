package com.interviewcopilot.controller;

import com.interviewcopilot.service.AuthService;
import com.interviewcopilot.service.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AuthControllerEmailTest {

    @Mock
    private AuthService authService;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private AuthController authController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
    }

    @Test
    @DisplayName("POST /api/v1/auth/test-email returns 200 with dispatch status true on SMTP success")
    void testTestEmailEndpoint_Success() throws Exception {
        when(emailService.sendVerificationEmail(eq("candidate@test.com"), anyString())).thenReturn(true);

        mockMvc.perform(post("/api/v1/auth/test-email")
                        .param("email", "candidate@test.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.recipient").value("candidate@test.com"))
                .andExpect(jsonPath("$.data.dispatchedViaSmtp").value(true))
                .andExpect(jsonPath("$.data.status").value("SENT_TO_SMTP_SERVER"));
    }

    @Test
    @DisplayName("POST /api/v1/auth/test-email returns 200 with fallback status on SMTP failure")
    void testTestEmailEndpoint_SmtpFailure() throws Exception {
        when(emailService.sendVerificationEmail(eq("candidate@test.com"), anyString())).thenReturn(false);

        mockMvc.perform(post("/api/v1/auth/test-email")
                        .param("email", "candidate@test.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.recipient").value("candidate@test.com"))
                .andExpect(jsonPath("$.data.dispatchedViaSmtp").value(false))
                .andExpect(jsonPath("$.data.status").value("SMTP_FAILED_CHECK_CONSOLE_LOGS"));
    }

    @Test
    @DisplayName("GET /api/v1/auth/delete-user returns 200 and invokes authService.deleteUserByEmail")
    void testDeleteUserEndpoint() throws Exception {
        org.mockito.Mockito.doNothing().when(authService).deleteUserByEmail("candidate@test.com");

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/api/v1/auth/delete-user")
                        .param("email", "candidate@test.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").value("User deleted successfully: candidate@test.com"));
    }
}

