package com.interviewcopilot.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendVerificationEmail(String to, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Verify Your Interview Copilot Account");
            
            String text = "Welcome to Interview Copilot!\n\n" +
                          "Your 6-digit email verification code is: " + otp + "\n\n" +
                          "Please enter this code in the application to activate your account.\n" +
                          "If you did not request this, please ignore this email.\n\n" +
                          "Best,\nThe Interview Copilot Team";
                          
            message.setText(text);
            mailSender.send(message);
            log.info("Successfully sent verification email to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to: {}. Did you configure your SMTP credentials in application.yml?", to, e);
            // Intentionally not throwing an exception here so that local development 
            // without SMTP credentials doesn't completely break registration.
        }
    }
}
