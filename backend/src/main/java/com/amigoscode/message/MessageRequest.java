package com.amigoscode.message;

public record MessageRequest(
        Integer receiverId,
        Integer itemId,
        String content
) {
}