package com.amigoscode.item;

import org.springframework.stereotype.Service;
import java.util.function.Function;

@Service
public class ItemDTOMapper implements Function<Item, ItemDTO> {

    @Override
    public ItemDTO apply(Item item) {
        return new ItemDTO(
                item.getId(),
                item.getTitle(),
                item.getDescription(),
                item.getPrice(),
                item.getCategory(),
                item.getImageId(),
                item.getStatus(),
                item.getSeller().getId().longValue(),
                item.getSeller().getName(),
                item.getSeller().getEmail(),
                item.getCreatedAt(),
                item.getUpdatedAt()
        );
    }
}