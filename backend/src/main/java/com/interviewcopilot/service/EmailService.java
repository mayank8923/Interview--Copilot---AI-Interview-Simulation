package com.interviewcopilot.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import org.springframework.scheduling.annotation.Async;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    // Hardcoded to the verified SendGrid Single Sender
    private String fromEmail = "vashisthamayank8@gmail.com";

    public void sendVerificationEmail(String to, String otp) {
        log.info("\n\n==============================================\nVERIFICATION CODE FOR {}: {}\nFROM: {}\n==============================================\n", to, otp, fromEmail);
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Verify Your Interview Copilot Account");
            
            String text = "Welcome to Interview Copilot!\n\n" +
                          "Your 6-digit email verification code is: " + otp + "\n\n" +
                          "Please enter this code in the application to activate your account.\n" +
                          "If you did not request this, please ignore this email.\n\n" +
                          "Best,\nThe Interview Copilot Team";
                          
            message.setText(text);
            mailSender.send(message);
            log.info("Successfully sent verification email via SMTP to: {}", to);
        } catch (Exception e) {
            log.error("SMTP DISPATCH FAILED for {}: {} ({})", to, e.getMessage(), e.getClass().getSimpleName());
            if (e.getCause() != null) {
                log.error("SMTP Root Cause: {}", e.getCause().getMessage());
            }
        }
    }
}
