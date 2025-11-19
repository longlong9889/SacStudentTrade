package com.amigoscode.favorite;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Integer> {

    // Find all favorites for a customer
    @Query("SELECT f FROM Favorite f WHERE f.customer.id = :customerId ORDER BY f.createdAt DESC")
    List<Favorite> findAllByCustomerId(@Param("customerId") Integer customerId);

    // Check if item is favorited by customer
    @Query("SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END FROM Favorite f " +
            "WHERE f.customer.id = :customerId AND f.item.id = :itemId")
    boolean existsByCustomerIdAndItemId(@Param("customerId") Integer customerId,
                                        @Param("itemId") Integer itemId);

    // Find specific favorite by customer and item
    @Query("SELECT f FROM Favorite f WHERE f.customer.id = :customerId AND f.item.id = :itemId")
    Optional<Favorite> findByCustomerIdAndItemId(@Param("customerId") Integer customerId,
                                                 @Param("itemId") Integer itemId);

    // Count favorites for an item
    @Query("SELECT COUNT(f) FROM Favorite f WHERE f.item.id = :itemId")
    Long countByItemId(@Param("itemId") Integer itemId);

    // Delete favorite by customer and item
    @Query("DELETE FROM Favorite f WHERE f.customer.id = :customerId AND f.item.id = :itemId")
    void deleteByCustomerIdAndItemId(@Param("customerId") Integer customerId,
                                     @Param("itemId") Integer itemId);
}