package com.interviewcopilot.dto.user;

import com.interviewcopilot.model.User;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class UserProfileResponse {
    private String id;
    private String email;
    private String name;
    private String targetRole;
    private String targetCompany;
    private String experienceLevel;
    private List<String> skillsList;
    private String preferredLanguage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static UserProfileResponse fromEntity(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .targetRole(user.getTargetRole())
                .targetCompany(user.getTargetCompany())
                .experienceLevel(user.getExperienceLevel())
                .skillsList(user.getSkillsList())
                .preferredLanguage(user.getPreferredLanguage())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}

