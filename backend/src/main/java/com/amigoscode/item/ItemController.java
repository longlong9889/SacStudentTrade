package com.amigoscode.item;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/items")
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping
    public ResponseEntity<List<ItemDTO>> getAllItems() {
        return ResponseEntity.ok(itemService.getAllItems());
    }

    @GetMapping("/available")
    public ResponseEntity<List<ItemDTO>> getAllAvailableItems() {
        return ResponseEntity.ok(itemService.getAllAvailableItems());
    }

    @GetMapping("/{itemId}")
    public ResponseEntity<ItemDTO> getItem(@PathVariable("itemId") Long itemId) {
        return ResponseEntity.ok(itemService.getItemById(itemId));
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<ItemDTO>> getItemsBySeller(
            @PathVariable("sellerId") Long sellerId) {
        return ResponseEntity.ok(itemService.getItemsBySellerId(sellerId));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ItemDTO>> getItemsByCategory(
            @PathVariable("category") String category) {
        return ResponseEntity.ok(itemService.getItemsByCategory(category));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ItemDTO>> searchItems(
            @RequestParam("q") String searchTerm) {
        return ResponseEntity.ok(itemService.searchItems(searchTerm));
    }

    @GetMapping("/price-range")
    public ResponseEntity<List<ItemDTO>> getItemsByPriceRange(
            @RequestParam("min") BigDecimal minPrice,
            @RequestParam("max") BigDecimal maxPrice) {
        return ResponseEntity.ok(itemService.getItemsByPriceRange(minPrice, maxPrice));
    }

    @PostMapping("/seller/{sellerId}")
    public ResponseEntity<ItemDTO> createItem(
            @PathVariable("sellerId") Long sellerId,
            @RequestBody ItemRegistrationRequest request) {
        ItemDTO item = itemService.createItem(sellerId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(item);
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<ItemDTO> updateItem(
            @PathVariable("itemId") Long itemId,
            @RequestBody ItemUpdateRequest updateRequest) {
        ItemDTO updatedItem = itemService.updateItem(itemId, updateRequest);
        return ResponseEntity.ok(updatedItem);
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> deleteItem(@PathVariable("itemId") Long itemId) {
        itemService.deleteItem(itemId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(
            value = "/{itemId}/image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Void> uploadItemImage(
            @PathVariable("itemId") Long itemId,
            @RequestParam("file") MultipartFile file) {
        itemService.uploadItemImage(itemId, file);
        return ResponseEntity.ok().build();
    }

    @GetMapping(
            value = "/{itemId}/image",
            produces = MediaType.IMAGE_JPEG_VALUE
    )
    public ResponseEntity<byte[]> getItemImage(@PathVariable("itemId") Long itemId) {
        byte[] image = itemService.getItemImage(itemId);
        return ResponseEntity.ok(image);
    }

    @PatchMapping("/{itemId}/mark-sold")
    public ResponseEntity<Void> markItemAsSold(@PathVariable("itemId") Long itemId) {
        itemService.markItemAsSold(itemId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{itemId}/mark-available")
    public ResponseEntity<Void> markItemAsAvailable(@PathVariable("itemId") Long itemId) {
        itemService.markItemAsAvailable(itemId);
        return ResponseEntity.ok().build();
    }
}