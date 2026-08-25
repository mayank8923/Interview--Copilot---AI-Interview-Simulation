package com.interviewcopilot.repository;

import com.interviewcopilot.model.ResumeAnalysis;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResumeAnalysisRepository extends MongoRepository<ResumeAnalysis, String> {
    Optional<ResumeAnalysis> findTopByUserIdOrderByCreatedAtDesc(String userId);
}

