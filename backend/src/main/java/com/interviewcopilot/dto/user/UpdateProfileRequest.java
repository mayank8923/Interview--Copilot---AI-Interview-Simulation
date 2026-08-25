package com.interviewcopilot.dto.user;

import lombok.Data;

import java.util.List;

@Data
public class UpdateProfileRequest {
    private String name;
    private String targetRole;
    private String targetCompany;
    private String experienceLevel;
    private List<String> skillsList;
    private String preferredLanguage;
}

