package com.amigoscode.item;

import com.amigoscode.customer.Customer;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "item")
public class item {

    @Id
    @SequenceGenerator(
            name = "item_id_seq",
            sequenceName = "item_id_seq",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "item_id_seq"
    )
    private Integer id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private String category;

    private String imageId; // for picture upload

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private Customer seller;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public item() {}

    public item(String title, String description, BigDecimal price, String category, Customer seller) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.category = category;
        this.seller = seller;
    }

    public Integer getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getImageId() { return imageId; }
    public void setImageId(String imageId) { this.imageId = imageId; }
    public Customer getSeller() { return seller; }
    public void setSeller(Customer seller) { this.seller = seller; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
