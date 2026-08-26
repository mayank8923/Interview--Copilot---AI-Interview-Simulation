package com.interviewcopilot.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.interviewcopilot.common.exception.BadRequestException;
import com.interviewcopilot.common.exception.UnauthorizedException;
import com.interviewcopilot.dto.auth.AuthResponse;
import com.interviewcopilot.dto.auth.GoogleLoginRequest;
import com.interviewcopilot.dto.auth.LoginRequest;
import com.interviewcopilot.dto.auth.RegisterRequest;
import com.interviewcopilot.model.User;
import com.interviewcopilot.repository.UserRepository;
import com.interviewcopilot.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final EmailService emailService;

    @Value("${app.google.client-id:placeholder}")
    private String googleClientId;

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!user.isEmailVerified()) {
            throw new UnauthorizedException("EMAIL_NOT_VERIFIED");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        
        return new AuthResponse(jwt);
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email address already in use.");
        }

        String pwd = request.getPassword();
        boolean isPassphrase = pwd != null && pwd.length() >= 15;
        boolean isComplex = pwd != null && pwd.length() >= 8 &&
                            pwd.matches(".*[A-Z].*") &&
                            pwd.matches(".*[a-z].*") &&
                            pwd.matches(".*[0-9].*") &&
                            pwd.matches(".*[^A-Za-z0-9].*");
                            
        if (!isPassphrase && !isComplex) {
            throw new BadRequestException("Password must be either a complex string (8+ chars, upper, lower, number, symbol) or a long passphrase (15+ chars).");
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        
        // This will block and throw an exception if SMTP is misconfigured.
        // For production, you might want this to run asynchronously.
        emailService.sendVerificationEmail(request.getEmail(), otp);

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.USER)
                .educationLevel(request.getEducationLevel())
                .experienceLevel(request.getExperienceLevel())
                .yearsOfExperience(request.getYearsOfExperience())
                .currentYear(request.getCurrentYear())
                .branch(request.getBranch())
                .isEmailVerified(false)
                .emailVerificationCode(otp)
                .build();

        userRepository.save(user);

        // Do not auto-login and return JWT since email is not verified
        return new AuthResponse("VERIFICATION_REQUIRED");
    }

    public void verifyEmail(String email, String code) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new BadRequestException("User not found"));

        if (user.getEmailVerificationCode() == null || !user.getEmailVerificationCode().equals(code)) {
            throw new BadRequestException("Invalid verification code");
        }

        user.setEmailVerified(true);
        user.setEmailVerificationCode(null);
        userRepository.save(user);
    }

    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new BadRequestException("User not found"));

        if (user.isEmailVerified()) {
            throw new BadRequestException("Email is already verified.");
        }

        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        user.setEmailVerificationCode(otp);
        userRepository.save(user);

        emailService.sendVerificationEmail(email, otp);
    }

    public AuthResponse googleLogin(GoogleLoginRequest request) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.getToken());
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                
                String googleId = payload.getSubject();
                String email = payload.getEmail();
                String name = (String) payload.get("name");

                Optional<User> userOptional = userRepository.findByEmail(email);
                User user;

                if (userOptional.isPresent()) {
                    user = userOptional.get();
                    // Update Google ID if not present
                    if (user.getGoogleId() == null) {
                        user.setGoogleId(googleId);
                        user.setEmailVerified(true);
                        userRepository.save(user);
                    } else if (!user.isEmailVerified()) {
                        user.setEmailVerified(true);
                        userRepository.save(user);
                    }
                } else {
                    // Register new user via Google
                    user = User.builder()
                            .name(name)
                            .email(email)
                            .googleId(googleId)
                            .role(User.Role.USER)
                            .isEmailVerified(true)
                            .build();
                    user = userRepository.save(user);
                }

                String jwt = tokenProvider.generateTokenFromUserId(user.getId(), user.getEmail());
                return new AuthResponse(jwt);

            } else {
                throw new UnauthorizedException("Invalid Google ID token");
            }
        } catch (Exception e) {
            log.error("Error verifying Google ID token", e);
            throw new UnauthorizedException("Google authentication failed");
        }
    }
}

