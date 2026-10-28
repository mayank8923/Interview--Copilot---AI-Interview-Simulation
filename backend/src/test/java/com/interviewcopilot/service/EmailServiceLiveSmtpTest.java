package com.interviewcopilot.service;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("dev")
@Disabled("Manual live SMTP verification: remove @Disabled or execute on demand to test live Gmail SMTP credentials")
class EmailServiceLiveSmtpTest {

    @Autowired
    private EmailService emailService;

    @Test
    @DisplayName("Send live test email using dev profile Gmail SMTP configuration")
    void sendLiveTestEmail() {
        String targetEmail = emailService.getFromEmail();
        boolean dispatched = emailService.sendVerificationEmail(targetEmail, "998877");
        System.out.println("=== LIVE SMTP DISPATCH RESULT: " + (dispatched ? "SUCCESS" : "FAILED") + " ===");
        assertThat(dispatched).isTrue();
    }
}

