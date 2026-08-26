package com.interviewcopilot.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewcopilot.common.api.ApiError;
import com.interviewcopilot.common.api.ApiResponse;
import com.interviewcopilot.service.RateLimitingService;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class RateLimitInterceptor implements HandlerInterceptor {

    private final RateLimitingService rateLimitingService;
    private final ObjectMapper objectMapper;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        
        // Only rate limit specific high-cost AI paths
        String path = request.getRequestURI();
        if (!path.contains("/api/v1/mock/") && !path.contains("/api/v1/resume/upload")) {
            return true; 
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return true; // Let Spring Security handle unauthorized requests
        }

        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        Bucket tokenBucket = rateLimitingService.resolveBucket(userDetails.getId());
        ConsumptionProbe probe = tokenBucket.tryConsumeAndReturnRemaining(1);

        if (probe.isConsumed()) {
            response.addHeader("X-Rate-Limit-Remaining", String.valueOf(probe.getRemainingTokens()));
            return true;
        } else {
            long waitForRefill = probe.getNanosToWaitForRefill() / 1_000_000_000;
            response.addHeader("X-Rate-Limit-Retry-After-Seconds", String.valueOf(waitForRefill));
            
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            
            ApiError error = ApiError.builder()
                .code("RATE_LIMIT_EXCEEDED")
                .details("You have exceeded the maximum number of AI requests. Please try again later.")
                .build();
                
            ApiResponse<Void> apiResponse = ApiResponse.error("Too many requests. Please wait " + waitForRefill + " seconds.", error);
            response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
            return false;
        }
    }
}

