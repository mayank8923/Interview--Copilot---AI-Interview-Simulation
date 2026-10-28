package com.interviewcopilot.dto.activity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserActivityResponse {
    private int currentStreak;
    private int longestStreak;
    private int totalActiveDays;
    private boolean isActiveToday;
    private LocalDate lastActiveDate;
    private Map<String, Integer> activityCalendar;
}

