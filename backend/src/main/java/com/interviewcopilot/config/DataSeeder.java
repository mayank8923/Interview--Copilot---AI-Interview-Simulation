package com.interviewcopilot.config;

import com.interviewcopilot.repository.QuestionRepository;
import com.interviewcopilot.service.QuestionGenerationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements ApplicationRunner {

    private final QuestionRepository questionRepository;
    private final QuestionGenerationService questionGenerationService;

    @Override
    public void run(ApplicationArguments args) {
        long count = questionRepository.count();
        if (count < 10) {
            log.info("Database has only {} questions. Triggering bulk generation for FAANG-level coverage...", count);
            int total = questionGenerationService.bulkGenerateAll();
            log.info("Successfully seeded {} questions across all companies, types, and difficulties.", total);
        } else {
            log.info("Database already contains {} questions. Skipping seeding.", count);
        }
    }
}
