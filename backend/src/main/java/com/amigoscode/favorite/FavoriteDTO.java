package com.amigoscode.favorite;

import com.amigoscode.item.ItemDTO;
import java.time.LocalDateTime;

public record FavoriteDTO(
        Integer id,
        Integer customerId,
        ItemDTO item,
        LocalDateTime createdAt
) {
}