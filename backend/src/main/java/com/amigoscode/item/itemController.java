package com.amigoscode.item;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/items")
public class itemController {

    private final itemService itemService;

    public itemController(itemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping
    public ResponseEntity<List<item>> getAllItems() {
        return ResponseEntity.ok(itemService.getAllItems());
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<item>> getItemsBySeller(@PathVariable Integer sellerId) {
        return ResponseEntity.ok(itemService.getItemsBySellerId(sellerId));
    }

    @PostMapping("/seller/{sellerId}")
    public ResponseEntity<item> createItem(@PathVariable Integer sellerId, @RequestBody item item) {
        return ResponseEntity.ok(itemService.createItem(sellerId, item));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<?> deleteItem(@PathVariable Integer itemId) {
        itemService.deleteItem(itemId);
        return ResponseEntity.noContent().build();
    }
}
