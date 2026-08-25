package com.interviewcopilot.service;

import com.interviewcopilot.common.exception.ResourceNotFoundException;
import com.interviewcopilot.model.Question;
import com.interviewcopilot.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {
    
    private final QuestionRepository questionRepository;

    public List<Question> getAllQuestions(String type, String difficulty) {
        if (type != null && difficulty != null) {
            return questionRepository.findByTypeAndDifficulty(type, difficulty);
        } else if (type != null) {
            return questionRepository.findByType(type);
        } else if (difficulty != null) {
            return questionRepository.findByDifficulty(difficulty);
        }
        return questionRepository.findAll();
    }

    public Question getQuestionById(String id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", id));
    }
}

