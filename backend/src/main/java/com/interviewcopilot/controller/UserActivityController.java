package com.interviewcopilot.controller;

import com.interviewcopilot.common.api.ApiResponse;
import com.interviewcopilot.dto.activity.UserActivityResponse;
import com.interviewcopilot.security.CustomUserDetails;
import com.interviewcopilot.service.UserActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/activity")
@RequiredArgsConstructor
public class UserActivityController {

    private final UserActivityService userActivityService;

    @GetMapping("/streak")
    public ResponseEntity<ApiResponse<UserActivityResponse>> getStreak(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        UserActivityResponse response = userActivityService.getActivity(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/ping")
    public ResponseEntity<ApiResponse<UserActivityResponse>> pingActivity(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        UserActivityResponse response = userActivityService.recordActivity(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok("Activity recorded", response));
    }
}

