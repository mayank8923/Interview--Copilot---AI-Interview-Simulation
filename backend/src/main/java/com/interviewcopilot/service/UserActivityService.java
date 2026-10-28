package com.interviewcopilot.service;

import com.interviewcopilot.dto.activity.UserActivityResponse;
import com.interviewcopilot.model.User;
import com.interviewcopilot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserActivityService {

    private final UserRepository userRepository;

    public synchronized UserActivityResponse recordActivity(String userId) {
        if (userId == null) return null;

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return null;

        LocalDate today = LocalDate.now();
        String todayKey = today.toString();

        Map<String, Integer> calendar = user.getActivityCalendar();
        if (calendar == null) {
            calendar = new HashMap<>();
            user.setActivityCalendar(calendar);
        }

        // Increment count for today
        calendar.put(todayKey, calendar.getOrDefault(todayKey, 0) + 1);

        LocalDate lastActive = user.getLastActiveDate();
        if (lastActive == null) {
            user.setCurrentStreak(1);
            user.setLongestStreak(1);
            user.setTotalActiveDays(1);
            user.setLastActiveDate(today);
        } else if (lastActive.equals(today)) {
            // Already active today; streak maintained
        } else if (lastActive.equals(today.minusDays(1))) {
            // Active yesterday, consecutive streak!
            int newStreak = user.getCurrentStreak() + 1;
            user.setCurrentStreak(newStreak);
            if (newStreak > user.getLongestStreak()) {
                user.setLongestStreak(newStreak);
            }
            user.setTotalActiveDays(user.getTotalActiveDays() + 1);
            user.setLastActiveDate(today);
        } else {
            // Gap > 1 day, streak reset to 1
            user.setCurrentStreak(1);
            user.setTotalActiveDays(user.getTotalActiveDays() + 1);
            user.setLastActiveDate(today);
        }

        userRepository.save(user);
        return getActivity(userId);
    }

    public UserActivityResponse getActivity(String userId) {
        if (userId == null) return null;

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return null;

        LocalDate today = LocalDate.now();
        LocalDate lastActive = user.getLastActiveDate();

        int effectiveStreak = user.getCurrentStreak();
        boolean isActiveToday = false;

        if (lastActive != null) {
            if (lastActive.equals(today)) {
                isActiveToday = true;
            } else if (lastActive.equals(today.minusDays(1))) {
                isActiveToday = false;
            } else {
                effectiveStreak = 0;
                isActiveToday = false;
            }
        } else {
            effectiveStreak = 0;
        }

        return UserActivityResponse.builder()
                .currentStreak(effectiveStreak)
                .longestStreak(user.getLongestStreak())
                .totalActiveDays(user.getTotalActiveDays())
                .isActiveToday(isActiveToday)
                .lastActiveDate(lastActive)
                .activityCalendar(user.getActivityCalendar() != null ? user.getActivityCalendar() : new HashMap<>())
                .build();
    }
}

