package com.interviewcopilot.repository;

import com.interviewcopilot.model.EvaluationReport;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EvaluationReportRepository extends MongoRepository<EvaluationReport, String> {
    Optional<EvaluationReport> findBySessionId(String sessionId);
    List<EvaluationReport> findByUserId(String userId);
}

