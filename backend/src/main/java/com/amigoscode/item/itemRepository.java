package com.amigoscode.item;

import com.amigoscode.customer.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface itemRepository extends JpaRepository<item, Integer> {
    List<item> findAllBySeller(Customer seller);
}
