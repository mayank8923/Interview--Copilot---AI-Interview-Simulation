package com.interviewcopilot.dto;

public class CodeExecutionRequest {
    private String language;
    private String code;
    private String mode = "run"; // "run" or "submit"

    public CodeExecutionRequest() {}

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMode() {
        return mode != null ? mode : "run";
    }

    public void setMode(String mode) {
        this.mode = mode;
    }
}

