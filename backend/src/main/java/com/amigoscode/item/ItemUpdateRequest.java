package com.amigoscode.item;

import java.math.BigDecimal;

public record ItemUpdateRequest(
        String title,
        String description,
        BigDecimal price,
        String category,
        ItemStatus status
) {
}