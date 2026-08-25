package com.interviewcopilot.config;

import com.interviewcopilot.model.Question;
import com.interviewcopilot.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements ApplicationRunner {

    private final QuestionRepository questionRepository;

    @Override
    public void run(ApplicationArguments args) {
        if (questionRepository.count() == 0) {
            log.info("Database is empty. Seeding default practice questions...");

            List<Question> defaultQuestions = Arrays.asList(
                    Question.builder()
                            .title("Two Sum")
                            .content("Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\n**Example:**\n```\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\n```")
                            .type("TECHNICAL")
                            .difficulty("EASY")
                            .tags(Arrays.asList("Array", "Hash Table"))
                            .build(),
                    Question.builder()
                            .title("Valid Palindrome")
                            .content("A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.")
                            .type("TECHNICAL")
                            .difficulty("EASY")
                            .tags(Arrays.asList("Two Pointers", "String"))
                            .build(),
                    Question.builder()
                            .title("Tell me about a time you failed")
                            .content("Describe a situation where you failed to meet a deadline or expectation. What happened, and what did you learn from the experience? We are looking for self-awareness and a growth mindset.")
                            .type("HR")
                            .difficulty("MEDIUM")
                            .tags(Arrays.asList("Behavioral", "Self-Awareness"))
                            .build(),
                    Question.builder()
                            .title("Design a URL Shortener")
                            .content("Design a service like TinyURL, a URL shortening service, a web service that provides short aliases for redirection of long URLs.\n\n**Requirements:**\n- High availability\n- Low latency for redirection\n- Volume: 100M URLs generated per month.")
                            .type("SYSTEM_DESIGN")
                            .difficulty("HARD")
                            .tags(Arrays.asList("System Design", "Scalability"))
                            .build(),
                    Question.builder()
                            .title("Merge Intervals")
                            .content("Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.")
                            .type("TECHNICAL")
                            .difficulty("MEDIUM")
                            .tags(Arrays.asList("Array", "Sorting"))
                            .build()
            );

            questionRepository.saveAll(defaultQuestions);
            log.info("Successfully seeded {} questions.", defaultQuestions.size());
        } else {
            log.info("Database already contains questions. Skipping seeding.");
        }
    }
}

