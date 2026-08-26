package com.interviewcopilot.controller;

import com.interviewcopilot.common.api.ApiResponse;
import com.interviewcopilot.dto.auth.AuthResponse;
import com.interviewcopilot.dto.auth.GoogleLoginRequest;
import com.interviewcopilot.dto.auth.LoginRequest;
import com.interviewcopilot.dto.auth.RegisterRequest;
import com.interviewcopilot.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/google")
    public ResponseEntity<ApiResponse<AuthResponse>> googleLogin(@Valid @RequestBody GoogleLoginRequest request) {
        AuthResponse response = authService.googleLogin(request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<String>> verifyEmail(@Valid @RequestBody com.interviewcopilot.dto.auth.VerifyEmailRequest request) {
        authService.verifyEmail(request.getEmail(), request.getCode());
        return ResponseEntity.ok(ApiResponse.ok("Email verified successfully"));
    }

    @PostMapping("/resend")
    public ResponseEntity<ApiResponse<String>> resendVerification(@RequestParam String email) {
        authService.resendVerificationEmail(email);
        return ResponseEntity.ok(ApiResponse.ok("Verification email resent successfully."));
    }
}

