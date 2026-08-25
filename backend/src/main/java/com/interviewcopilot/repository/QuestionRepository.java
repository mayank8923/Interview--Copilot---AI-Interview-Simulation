package com.interviewcopilot.repository;

import com.interviewcopilot.model.Question;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends MongoRepository<Question, String> {
    List<Question> findByType(String type);
    List<Question> findByDifficulty(String difficulty);
    List<Question> findByTypeAndDifficulty(String type, String difficulty);
}

