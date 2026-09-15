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
        return getAllQuestions(type, difficulty, null, null);
    }

    public List<Question> getAllQuestions(String type, String difficulty, String topic, String search) {
        List<Question> list = questionRepository.findAll();
        return list.stream()
                .filter(q -> type == null || type.isBlank() || type.equalsIgnoreCase(q.getType()))
                .filter(q -> difficulty == null || difficulty.isBlank() || difficulty.equalsIgnoreCase(q.getDifficulty()))
                .filter(q -> topic == null || topic.isBlank() || (q.getTopic() != null && q.getTopic().toLowerCase().contains(topic.toLowerCase())))
                .filter(q -> {
                    if (search == null || search.isBlank()) return true;
                    String s = search.toLowerCase();
                    boolean inTitle = q.getTitle() != null && q.getTitle().toLowerCase().contains(s);
                    boolean inContent = q.getContent() != null && q.getContent().toLowerCase().contains(s);
                    boolean inTopic = q.getTopic() != null && q.getTopic().toLowerCase().contains(s);
                    boolean inCompany = q.getTargetCompany() != null && q.getTargetCompany().toLowerCase().contains(s);
                    boolean inTags = q.getTags() != null && q.getTags().stream().anyMatch(t -> t.toLowerCase().contains(s));
                    return inTitle || inContent || inTopic || inCompany || inTags;
                })
                .toList();
    }

    public Question getQuestionById(String id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", id));
    }
}

