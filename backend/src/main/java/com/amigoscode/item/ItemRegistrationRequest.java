package com.amigoscode.item;

import java.math.BigDecimal;

public record ItemRegistrationRequest(
        String title,
        String description,
        BigDecimal price,
        String category
) {
}