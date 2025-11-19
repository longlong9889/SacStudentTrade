package com.amigoscode.favorite;

import com.amigoscode.item.ItemDTOMapper;
import org.springframework.stereotype.Service;
import java.util.function.Function;

@Service
public class FavoriteDTOMapper implements Function<Favorite, FavoriteDTO> {

    private final ItemDTOMapper itemDTOMapper;

    public FavoriteDTOMapper(ItemDTOMapper itemDTOMapper) {
        this.itemDTOMapper = itemDTOMapper;
    }

    @Override
    public FavoriteDTO apply(Favorite favorite) {
        return new FavoriteDTO(
                favorite.getId(),
                favorite.getCustomer().getId(),
                itemDTOMapper.apply(favorite.getItem()),
                favorite.getCreatedAt()
        );
    }
}