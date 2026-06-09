package com.example.QuickBite.exception;

public record ErrorResponse(
        String message,
        int status
) {
}
