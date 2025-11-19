package com.amigoscode.favorite;

import com.amigoscode.customer.Customer;
import com.amigoscode.customer.CustomerRepository;
import com.amigoscode.exception.DuplicateResourceException;
import com.amigoscode.exception.ResourceNotFoundException;
import com.amigoscode.item.Item;
import com.amigoscode.item.ItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final CustomerRepository customerRepository;
    private final ItemRepository itemRepository;
    private final FavoriteDTOMapper favoriteDTOMapper;

    public FavoriteService(FavoriteRepository favoriteRepository,
                           CustomerRepository customerRepository,
                           ItemRepository itemRepository,
                           FavoriteDTOMapper favoriteDTOMapper) {
        this.favoriteRepository = favoriteRepository;
        this.customerRepository = customerRepository;
        this.itemRepository = itemRepository;
        this.favoriteDTOMapper = favoriteDTOMapper;
    }

    public List<FavoriteDTO> getFavoritesByCustomerId(Integer customerId) {
        if (!customerRepository.existsById(customerId)) {
            throw new ResourceNotFoundException(
                    "Customer with id [%s] not found".formatted(customerId)
            );
        }
        return favoriteRepository.findAllByCustomerId(customerId)
                .stream()
                .map(favoriteDTOMapper)
                .collect(Collectors.toList());
    }

    public boolean isItemFavorited(Integer customerId, Integer itemId) {
        return favoriteRepository.existsByCustomerIdAndItemId(customerId, itemId);
    }

    public Long getFavoriteCountForItem(Integer itemId) {
        if (!itemRepository.existsById(itemId)) {
            throw new ResourceNotFoundException(
                    "Item with id [%s] not found".formatted(itemId)
            );
        }
        return favoriteRepository.countByItemId(itemId);
    }

    @Transactional
    public FavoriteDTO addFavorite(Integer customerId, Integer itemId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Customer with id [%s] not found".formatted(customerId)
                ));

        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Item with id [%s] not found".formatted(itemId)
                ));

        if (favoriteRepository.existsByCustomerIdAndItemId(customerId, itemId)) {
            throw new DuplicateResourceException(
                    "Item is already in favorites"
            );
        }

        Favorite favorite = new Favorite(customer, item);
        Favorite savedFavorite = favoriteRepository.save(favorite);
        return favoriteDTOMapper.apply(savedFavorite);
    }

    @Transactional
    public void removeFavorite(Integer customerId, Integer itemId) {
        Favorite favorite = favoriteRepository.findByCustomerIdAndItemId(customerId, itemId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Favorite not found for customer [%s] and item [%s]"
                                .formatted(customerId, itemId)
                ));
        favoriteRepository.delete(favorite);
    }

    @Transactional
    public void toggleFavorite(Integer customerId, Integer itemId) {
        if (favoriteRepository.existsByCustomerIdAndItemId(customerId, itemId)) {
            removeFavorite(customerId, itemId);
        } else {
            addFavorite(customerId, itemId);
        }
    }
}