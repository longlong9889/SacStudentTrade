package com.amigoscode.message;

public record MessageRequest(
        Integer receiverId,
        Long itemId,
        String content
) {
}