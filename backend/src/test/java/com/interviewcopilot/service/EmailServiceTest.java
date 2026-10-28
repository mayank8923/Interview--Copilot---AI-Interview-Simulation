package com.interviewcopilot.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.net.ConnectException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    private EmailService emailService;

    @BeforeEach
    void setUp() {
        emailService = new EmailService(mailSender);
        emailService.setFromEmail("noreply@interviewcopilot.com");
    }

    @Test
    @DisplayName("Should construct proper SimpleMailMessage and return true when mailSender succeeds")
    void testSendVerificationEmail_Success() {
        String recipient = "candidate@example.com";
        String otp = "123456";

        boolean result = emailService.sendVerificationEmail(recipient, otp);

        assertThat(result).isTrue();

        ArgumentCaptor<SimpleMailMessage> messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender, times(1)).send(messageCaptor.capture());

        SimpleMailMessage captured = messageCaptor.getValue();
        assertThat(captured.getTo()).containsExactly(recipient);
        assertThat(captured.getFrom()).isEqualTo("noreply@interviewcopilot.com");
        assertThat(captured.getSubject()).isEqualTo("Verify Your Interview Copilot Account");
        assertThat(captured.getText()).contains("123456");
        assertThat(captured.getText()).contains("Welcome to Interview Copilot!");
    }

    @Test
    @DisplayName("Should use customized sender email when configured")
    void testSendVerificationEmail_CustomFromEmail() {
        emailService.setFromEmail("custom-sender@interviewcopilot.com");
        String recipient = "candidate@example.com";
        String otp = "654321";

        boolean result = emailService.sendVerificationEmail(recipient, otp);

        assertThat(result).isTrue();

        ArgumentCaptor<SimpleMailMessage> messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender, times(1)).send(messageCaptor.capture());

        SimpleMailMessage captured = messageCaptor.getValue();
        assertThat(captured.getFrom()).isEqualTo("custom-sender@interviewcopilot.com");
        assertThat(captured.getText()).contains("654321");
    }

    @Test
    @DisplayName("Should catch MailSendException, log error, and return false without crashing caller")
    void testSendVerificationEmail_SmtpFailure_HandlesExceptionGracefully() {
        doThrow(new MailSendException("535 Authentication failed: Bad credentials"))
                .when(mailSender).send(any(SimpleMailMessage.class));

        boolean result = emailService.sendVerificationEmail("candidate@example.com", "123456");

        assertThat(result).isFalse();
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    @DisplayName("Should handle nested exception cause without throwing")
    void testSendVerificationEmail_NestedCause_HandlesGracefully() {
        ConnectException cause = new ConnectException("Connection timed out to smtp.sendgrid.net");
        doThrow(new MailSendException("SMTP transmission error", cause))
                .when(mailSender).send(any(SimpleMailMessage.class));

        boolean result = emailService.sendVerificationEmail("candidate@example.com", "999999");

        assertThat(result).isFalse();
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }
}

