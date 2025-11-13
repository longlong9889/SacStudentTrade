package com.amigoscode.item;

import com.amigoscode.customer.Customer;
import com.amigoscode.customer.CustomerRepository;
import com.amigoscode.exception.RequestValidationException;
import com.amigoscode.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import s3.S3Buckets;
import s3.S3Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ItemService {

    private final ItemRepository itemRepository;
    private final CustomerRepository customerRepository;
    private final ItemDTOMapper itemDTOMapper;
    private final S3Service s3Service;
    private final S3Buckets s3Buckets;

    public ItemService(ItemRepository itemRepository,
                       CustomerRepository customerRepository,
                       ItemDTOMapper itemDTOMapper,
                       S3Service s3Service,
                       S3Buckets s3Buckets) {
        this.itemRepository = itemRepository;
        this.customerRepository = customerRepository;
        this.itemDTOMapper = itemDTOMapper;
        this.s3Service = s3Service;
        this.s3Buckets = s3Buckets;
    }

    public List<ItemDTO> getAllItems() {
        return itemRepository.findAll()
                .stream()
                .map(itemDTOMapper)
                .collect(Collectors.toList());
    }

    public List<ItemDTO> getAllAvailableItems() {
        return itemRepository.findAllAvailable()
                .stream()
                .map(itemDTOMapper)
                .collect(Collectors.toList());
    }

    public ItemDTO getItemById(Integer id) {
        return itemRepository.findById(id)
                .map(itemDTOMapper)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Item with id [%s] not found".formatted(id)
                ));
    }

    public List<ItemDTO> getItemsBySellerId(Integer sellerId) {
        if (!customerRepository.existsById(sellerId)) {
            throw new ResourceNotFoundException(
                    "Seller with id [%s] not found".formatted(sellerId)
            );
        }
        return itemRepository.findAllBySellerId(sellerId)
                .stream()
                .map(itemDTOMapper)
                .collect(Collectors.toList());
    }

    public List<ItemDTO> getItemsByCategory(String category) {
        return itemRepository.findByCategory(category)
                .stream()
                .map(itemDTOMapper)
                .collect(Collectors.toList());
    }

    public List<ItemDTO> searchItems(String searchTerm) {
        return itemRepository.searchItems(searchTerm)
                .stream()
                .map(itemDTOMapper)
                .collect(Collectors.toList());
    }

    public List<ItemDTO> getItemsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return itemRepository.findByPriceRange(minPrice, maxPrice)
                .stream()
                .map(itemDTOMapper)
                .collect(Collectors.toList());
    }

    public ItemDTO createItem(Integer sellerId, ItemRegistrationRequest request) {
        Customer seller = customerRepository.findById(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Seller with id [%s] not found".formatted(sellerId)
                ));

        Item item = new Item(
                request.title(),
                request.description(),
                request.price(),
                request.category(),
                seller
        );

        Item savedItem = itemRepository.save(item);
        return itemDTOMapper.apply(savedItem);
    }

    public ItemDTO updateItem(Integer itemId, ItemUpdateRequest updateRequest) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Item with id [%s] not found".formatted(itemId)
                ));

        boolean changes = false;

        if (updateRequest.title() != null && !updateRequest.title().equals(item.getTitle())) {
            item.setTitle(updateRequest.title());
            changes = true;
        }

        if (updateRequest.description() != null && !updateRequest.description().equals(item.getDescription())) {
            item.setDescription(updateRequest.description());
            changes = true;
        }

        if (updateRequest.price() != null && !updateRequest.price().equals(item.getPrice())) {
            item.setPrice(updateRequest.price());
            changes = true;
        }

        if (updateRequest.category() != null && !updateRequest.category().equals(item.getCategory())) {
            item.setCategory(updateRequest.category());
            changes = true;
        }

        if (updateRequest.status() != null && !updateRequest.status().equals(item.getStatus())) {
            item.setStatus(updateRequest.status());
            changes = true;
        }

        if (!changes) {
            throw new RequestValidationException("No data changes found");
        }

        Item updatedItem = itemRepository.save(item);
        return itemDTOMapper.apply(updatedItem);
    }

    public void deleteItem(Integer itemId) {
        if (!itemRepository.existsById(itemId)) {
            throw new ResourceNotFoundException(
                    "Item with id [%s] not found".formatted(itemId)
            );
        }
        itemRepository.deleteById(itemId);
    }

    public void uploadItemImage(Integer itemId, MultipartFile file) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Item with id [%s] not found".formatted(itemId)
                ));

        String imageId = UUID.randomUUID().toString();
        try {
            s3Service.putObject(
                    s3Buckets.getCustomer(),
                    "item-images/%s/%s".formatted(itemId, imageId),
                    file.getBytes()
            );
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image", e);
        }

        item.setImageId(imageId);
        itemRepository.save(item);
    }

    public byte[] getItemImage(Integer itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Item with id [%s] not found".formatted(itemId)
                ));

        if (item.getImageId() == null || item.getImageId().isBlank()) {
            throw new ResourceNotFoundException(
                    "Item with id [%s] has no image".formatted(itemId)
            );
        }

        return s3Service.getObject(
                s3Buckets.getCustomer(),
                "item-images/%s/%s".formatted(itemId, item.getImageId())
        );
    }

    public void markItemAsSold(Integer itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Item with id [%s] not found".formatted(itemId)
                ));
        item.setStatus(ItemStatus.SOLD);
        itemRepository.save(item);
    }

    public void markItemAsAvailable(Integer itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Item with id [%s] not found".formatted(itemId)
                ));
        item.setStatus(ItemStatus.AVAILABLE);
        itemRepository.save(item);
    }
}