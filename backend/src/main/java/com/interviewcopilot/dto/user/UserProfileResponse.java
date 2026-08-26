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
    private List<String> skillsList;
    private String preferredLanguage;

    // Profiling fields
    private String educationLevel;
    private String experienceLevel;
    private Integer yearsOfExperience;
    private String currentYear;
    private String branch;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static UserProfileResponse fromEntity(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .targetRole(user.getTargetRole())
                .targetCompany(user.getTargetCompany())
                .educationLevel(user.getEducationLevel())
                .experienceLevel(user.getExperienceLevel())
                .yearsOfExperience(user.getYearsOfExperience())
                .currentYear(user.getCurrentYear())
                .branch(user.getBranch())
                .skillsList(user.getSkillsList())
                .preferredLanguage(user.getPreferredLanguage())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}

