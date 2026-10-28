package com.interviewcopilot.service;

import com.interviewcopilot.common.exception.BadRequestException;
import com.interviewcopilot.dto.auth.AuthResponse;
import com.interviewcopilot.dto.auth.RegisterRequest;
import com.interviewcopilot.model.User;
import com.interviewcopilot.repository.UserRepository;
import com.interviewcopilot.security.JwtTokenProvider;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceEmailTest {

    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtTokenProvider tokenProvider;
    @Mock
    private EmailService emailService;

    @InjectMocks
    private AuthService authService;

    @Test
    @DisplayName("Registration generates OTP and invokes emailService.sendVerificationEmail")
    void testRegister_TriggersEmailVerification() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Alice");
        request.setEmail("alice@test.com");
        request.setPassword("StrongP@ssw0rd!");

        when(userRepository.findByEmail("alice@test.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode(any())).thenReturn("hashed_pwd");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AuthResponse response = authService.register(request);

        assertThat(response.getToken()).isEqualTo("VERIFICATION_REQUIRED");

        ArgumentCaptor<String> otpCaptor = ArgumentCaptor.forClass(String.class);
        verify(emailService, times(1)).sendVerificationEmail(eq("alice@test.com"), otpCaptor.capture());

        String generatedOtp = otpCaptor.getValue();
        assertThat(generatedOtp).hasSize(6);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository, times(1)).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();
        assertThat(savedUser.isEmailVerified()).isFalse();
        assertThat(savedUser.getEmailVerificationCode()).isEqualTo(generatedOtp);
    }

    @Test
    @DisplayName("Registration with stale unverified account purges old unverified user and registers cleanly")
    void testRegister_StaleUnverifiedUser_PurgedAndReRegistered() {
        User staleUser = User.builder()
                .email("stale@test.com")
                .isEmailVerified(false)
                .build();

        RegisterRequest request = new RegisterRequest();
        request.setName("Stale User");
        request.setEmail("stale@test.com");
        request.setPassword("StrongP@ssw0rd!");

        when(userRepository.findByEmail("stale@test.com")).thenReturn(Optional.of(staleUser));
        when(passwordEncoder.encode(any())).thenReturn("hashed_pwd");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AuthResponse response = authService.register(request);

        verify(userRepository, times(1)).delete(staleUser);
        verify(userRepository, times(1)).save(any(User.class));
        verify(emailService, times(1)).sendVerificationEmail(eq("stale@test.com"), anyString());
        assertThat(response.getToken()).isEqualTo("VERIFICATION_REQUIRED");
    }

    @Test
    @DisplayName("deleteUserByEmail removes user from database if found")
    void testDeleteUserByEmail_DeletesUser() {
        User user = User.builder().email("delete_me@test.com").build();
        when(userRepository.findByEmail("delete_me@test.com")).thenReturn(Optional.of(user));

        authService.deleteUserByEmail("delete_me@test.com");

        verify(userRepository, times(1)).delete(user);
    }

    @Test
    @DisplayName("Resend verification regenerates OTP and invokes emailService")
    void testResendVerification_TriggersEmail() {
        User unverifiedUser = User.builder()
                .email("bob@test.com")
                .isEmailVerified(false)
                .emailVerificationCode("111111")
                .build();

        when(userRepository.findByEmail("bob@test.com")).thenReturn(Optional.of(unverifiedUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        authService.resendVerificationEmail("bob@test.com");

        verify(emailService, times(1)).sendVerificationEmail(eq("bob@test.com"), anyString());
        verify(userRepository, times(1)).save(unverifiedUser);
    }

    @Test
    @DisplayName("Resend verification fails if user is already verified")
    void testResendVerification_AlreadyVerified_ThrowsException() {
        User verifiedUser = User.builder()
                .email("carol@test.com")
                .isEmailVerified(true)
                .build();

        when(userRepository.findByEmail("carol@test.com")).thenReturn(Optional.of(verifiedUser));

        assertThatThrownBy(() -> authService.resendVerificationEmail("carol@test.com"))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("already verified");

        verifyNoInteractions(emailService);
    }
}
