package com.amigoscode.message;

import java.time.LocalDateTime;

public record MessageDTO(
        Integer id,
        Integer senderId,
        String senderName,
        Integer receiverId,
        String receiverName,
        Integer itemId,
        String itemTitle,
        String content,
        Boolean isRead,
        LocalDateTime createdAt
) {
}