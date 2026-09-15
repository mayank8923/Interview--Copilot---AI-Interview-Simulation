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
        // 1. Smart Cleanup: Merge identical questions with different companies
        java.util.List<com.interviewcopilot.model.Question> all = questionRepository.findAll();
        java.util.Map<String, com.interviewcopilot.model.Question> uniqueQuestions = new java.util.HashMap<>();
        java.util.List<com.interviewcopilot.model.Question> duplicates = new java.util.ArrayList<>();

        for (com.interviewcopilot.model.Question q : all) {
            String title = q.getTitle();
            // Remove " (Company)" from the end of the title if it exists
            if (title.matches(".* \\(.*\\)$")) {
                title = title.substring(0, title.lastIndexOf(" ("));
                q.setTitle(title);
            }

            if (uniqueQuestions.containsKey(title)) {
                com.interviewcopilot.model.Question existing = uniqueQuestions.get(title);
                String existingCompanies = existing.getTargetCompany();
                String newCompany = q.getTargetCompany();
                
                if (existingCompanies != null && newCompany != null && !existingCompanies.contains(newCompany)) {
                    existing.setTargetCompany(existingCompanies + ", " + newCompany);
                    questionRepository.save(existing);
                }
                duplicates.add(q);
            } else {
                uniqueQuestions.put(title, q);
                questionRepository.save(q); // Save the cleaned title
            }
        }

        if (!duplicates.isEmpty()) {
            questionRepository.deleteAll(duplicates);
            log.info("Merged companies and cleaned up {} duplicate questions from the database.", duplicates.size());
        }

        long count = questionRepository.count();
        log.info("Database currently has {} questions. Verifying coverage of domain-specific, system design, and behavioral questions...", count);
        int newlyAdded = questionGenerationService.bulkGenerateAll();
        long totalNow = questionRepository.count();
        log.info("Question sync complete. Added {} new questions. Total active questions in database: {}", newlyAdded, totalNow);
    }
}
