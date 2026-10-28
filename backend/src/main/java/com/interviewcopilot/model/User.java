package com.interviewcopilot.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String passwordHash; // Null for Google OAuth users

    @Indexed(unique = true, sparse = true)
    private String googleId;

    private String name;

    private String targetRole;
    private String targetCompany;
    
    private List<String> skillsList;
    private String preferredLanguage;

    // New Profiling Fields
    private String educationLevel; // "GRADUATE" or "UNDERGRADUATE"
    private String experienceLevel; // "FRESHER" or "EXPERIENCED"
    private Integer yearsOfExperience; // e.g. 3
    private String currentYear; // e.g. "3rd Year"
    private String branch; // e.g. "Computer Science"

    // Streak & Activity Tracking
    private int currentStreak;
    private int longestStreak;
    private LocalDate lastActiveDate;
    private int totalActiveDays;

    @Builder.Default
    private Map<String, Integer> activityCalendar = new HashMap<>();

    private boolean isEmailVerified;
    private String emailVerificationCode;

    private Role role;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum Role {
        USER, ADMIN
    }
}

