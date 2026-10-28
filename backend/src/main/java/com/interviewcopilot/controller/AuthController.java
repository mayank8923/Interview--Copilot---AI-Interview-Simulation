package com.interviewcopilot.controller;

import com.interviewcopilot.common.api.ApiResponse;
import com.interviewcopilot.dto.auth.AuthResponse;
import com.interviewcopilot.dto.auth.GoogleLoginRequest;
import com.interviewcopilot.dto.auth.LoginRequest;
import com.interviewcopilot.dto.auth.RegisterRequest;
import com.interviewcopilot.service.AuthService;
import com.interviewcopilot.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final EmailService emailService;

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

    @PostMapping("/test-email")
    public ResponseEntity<ApiResponse<Map<String, Object>>> testEmail(@RequestParam String email) {
        String testOtp = String.format("%06d", new java.util.Random().nextInt(999999));
        boolean dispatched = emailService.sendVerificationEmail(email, testOtp);
        Map<String, Object> result = new HashMap<>();
        result.put("recipient", email);
        result.put("testOtp", testOtp);
        result.put("dispatchedViaSmtp", dispatched);
        result.put("status", dispatched ? "SENT_TO_SMTP_SERVER" : "SMTP_FAILED_CHECK_CONSOLE_LOGS");
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @RequestMapping(value = "/delete-user", method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE})
    public ResponseEntity<ApiResponse<String>> deleteUser(@RequestParam String email) {
        try {
            authService.deleteUserByEmail(email);
            return ResponseEntity.ok(ApiResponse.ok("User deleted successfully: " + email));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to delete user: " + e.getMessage(), null));
        }
    }
}

