package com.interviewcopilot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class InterviewCopilotApplication {

    public static void main(String[] args) {
        SpringApplication.run(InterviewCopilotApplication.class, args);
    }
}

