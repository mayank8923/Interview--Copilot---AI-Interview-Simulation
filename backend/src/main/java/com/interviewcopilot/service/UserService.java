package com.interviewcopilot.service;

import com.interviewcopilot.common.exception.ResourceNotFoundException;
import com.interviewcopilot.dto.user.UpdateProfileRequest;
import com.interviewcopilot.dto.user.UserProfileResponse;
import com.interviewcopilot.model.User;
import com.interviewcopilot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserProfileResponse getCurrentUserProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return UserProfileResponse.fromEntity(user);
    }

    public UserProfileResponse updateProfile(String userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (request.getName() != null) user.setName(request.getName());
        if (request.getTargetRole() != null) user.setTargetRole(request.getTargetRole());
        if (request.getTargetCompany() != null) user.setTargetCompany(request.getTargetCompany());
        if (request.getExperienceLevel() != null) user.setExperienceLevel(request.getExperienceLevel());
        if (request.getSkillsList() != null) user.setSkillsList(request.getSkillsList());
        if (request.getPreferredLanguage() != null) user.setPreferredLanguage(request.getPreferredLanguage());

        User updatedUser = userRepository.save(user);
        return UserProfileResponse.fromEntity(updatedUser);
    }
}

