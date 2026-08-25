package com.interviewcopilot.repository;

import com.interviewcopilot.model.MockInterviewSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MockInterviewSessionRepository extends MongoRepository<MockInterviewSession, String> {
    List<MockInterviewSession> findByUserId(String userId);
}

