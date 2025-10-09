package com.amigoscode.item;

import com.amigoscode.customer.Customer;
import com.amigoscode.customer.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class itemService {

    private final itemRepository itemRepository;
    private final CustomerRepository customerRepository;

    public itemService(itemRepository itemRepository, CustomerRepository customerRepository) {
        this.itemRepository = itemRepository;
        this.customerRepository = customerRepository;
    }

    public List<item> getAllItems() {
        return itemRepository.findAll();
    }

    public List<item> getItemsBySellerId(Integer sellerId) {
        Customer seller = customerRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));
        return itemRepository.findAllBySeller(seller);
    }

    public item createItem(Integer sellerId, item item) {
        Customer seller = customerRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));
        item.setSeller(seller);
        return itemRepository.save(item);
    }

    public void deleteItem(Integer id) {
        if (!itemRepository.existsById(id)) {
            throw new RuntimeException("Item not found");
        }
        itemRepository.deleteById(id);
    }
}
