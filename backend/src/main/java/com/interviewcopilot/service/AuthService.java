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

    @Value("${app.google.client-id:placeholder}")
    private String googleClientId;

    public AuthResponse login(LoginRequest request) {
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

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.USER)
                .build();

        User savedUser = userRepository.save(user);

        // Auto-login after registration
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
                        userRepository.save(user);
                    }
                } else {
                    // Register new user via Google
                    user = User.builder()
                            .name(name)
                            .email(email)
                            .googleId(googleId)
                            .role(User.Role.USER)
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

