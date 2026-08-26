package com.interviewcopilot.repository;

import com.interviewcopilot.model.ChatInterviewSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatInterviewSessionRepository extends MongoRepository<ChatInterviewSession, String> {
    List<ChatInterviewSession> findByUserId(String userId);
}

