package com.amigoscode.message;

import java.time.LocalDateTime;

public record MessageDTO(
        Long id,
        Integer senderId,
        String senderName,
        Integer receiverId,
        String receiverName,
        Long itemId,
        String itemTitle,
        String content,
        Boolean isRead,
        LocalDateTime createdAt
) {
}