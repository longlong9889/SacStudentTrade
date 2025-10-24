package com.amigoscode.item;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Integer> {

    // Find items by seller ID
    @Query("SELECT i FROM Item i WHERE i.seller.id = :sellerId")
    List<Item> findAllBySellerId(@Param("sellerId") Integer sellerId);

    // Find items by category
    List<Item> findByCategory(String category);

    // Find items by status
    List<Item> findByStatus(ItemStatus status);

    // Find available items only
    @Query("SELECT i FROM Item i WHERE i.status = 'AVAILABLE'")
    List<Item> findAllAvailable();

    // Search items by title or description
    @Query("SELECT i FROM Item i WHERE " +
            "LOWER(i.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(i.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Item> searchItems(@Param("searchTerm") String searchTerm);

    // Find items by price range
    @Query("SELECT i FROM Item i WHERE i.price BETWEEN :minPrice AND :maxPrice")
    List<Item> findByPriceRange(@Param("minPrice") BigDecimal minPrice,
                                @Param("maxPrice") BigDecimal maxPrice);

    // Find items by category and status
    List<Item> findByCategoryAndStatus(String category, ItemStatus status);

    // Find available items by seller
    @Query("SELECT i FROM Item i WHERE i.seller.id = :sellerId AND i.status = 'AVAILABLE'")
    List<Item> findAvailableItemsBySellerId(@Param("sellerId") Integer sellerId);
}