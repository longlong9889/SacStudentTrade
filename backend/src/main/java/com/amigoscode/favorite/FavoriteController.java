package com.amigoscode.favorite;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<FavoriteDTO>> getFavorites(
            @PathVariable("customerId") Integer customerId) {
        return ResponseEntity.ok(favoriteService.getFavoritesByCustomerId(customerId));
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> isFavorited(
            @RequestParam("customerId") Integer customerId,
            @RequestParam("itemId") Integer itemId) {
        return ResponseEntity.ok(favoriteService.isItemFavorited(customerId, itemId));
    }

    @GetMapping("/count/{itemId}")
    public ResponseEntity<Long> getFavoriteCount(@PathVariable("itemId") Integer itemId) {
        return ResponseEntity.ok(favoriteService.getFavoriteCountForItem(itemId));
    }

    @PostMapping
    public ResponseEntity<FavoriteDTO> addFavorite(
            @RequestParam("customerId") Integer customerId,
            @RequestParam("itemId") Integer itemId) {
        FavoriteDTO favorite = favoriteService.addFavorite(customerId, itemId);
        return ResponseEntity.status(HttpStatus.CREATED).body(favorite);
    }

    @DeleteMapping
    public ResponseEntity<Void> removeFavorite(
            @RequestParam("customerId") Integer customerId,
            @RequestParam("itemId") Integer itemId) {
        favoriteService.removeFavorite(customerId, itemId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/toggle")
    public ResponseEntity<Void> toggleFavorite(
            @RequestParam("customerId") Integer customerId,
            @RequestParam("itemId") Integer itemId) {
        favoriteService.toggleFavorite(customerId, itemId);
        return ResponseEntity.ok().build();
    }
}