package com.interviewcopilot.common.constants;

public final class AppConstants {

    private AppConstants() {
        // Prevent instantiation
    }

    public static final String API_V1_PREFIX = "/api/v1";
    public static final String DEFAULT_PAGE_NUMBER = "0";
    public static final String DEFAULT_PAGE_SIZE = "10";
    public static final int MAX_PAGE_SIZE = 50;

    public static final String AUTH_HEADER = "Authorization";
    public static final String BEARER_PREFIX = "Bearer ";

    public static final long MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
}

