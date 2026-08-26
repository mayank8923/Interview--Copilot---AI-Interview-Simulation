package com.interviewcopilot;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class InterviewCopilotApplicationTests {

    @Test
    void contextLoads() {
        // Verifies Spring application context loads without failure
    }
}

