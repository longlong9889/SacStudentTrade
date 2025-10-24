package com.amigoscode.item;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ItemDTO(
        Integer id,
        String title,
        String description,
        BigDecimal price,
        String category,
        String imageId,
        ItemStatus status,
        Integer sellerId,
        String sellerName,
        String sellerEmail,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}

