package com.interviewcopilot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableMongoAuditing
@EnableAsync
public class InterviewCopilotApplication {

    public static void main(String[] args) {
        SpringApplication.run(InterviewCopilotApplication.class, args);
    }
}

