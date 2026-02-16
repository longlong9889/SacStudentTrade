-- Create item table
CREATE TABLE item (
                      id BIGSERIAL PRIMARY KEY,
                      title VARCHAR(255) NOT NULL,
                      description VARCHAR(2000),
                      price DECIMAL(10, 2) NOT NULL,
                      category VARCHAR(100) NOT NULL,
                      image_id VARCHAR(36),
                      seller_id BIGINT NOT NULL,
                      status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
                      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                      CONSTRAINT fk_seller FOREIGN KEY (seller_id) REFERENCES customer(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_item_seller_id ON item(seller_id);
CREATE INDEX idx_item_category ON item(category);
CREATE INDEX idx_item_status ON item(status);
CREATE INDEX idx_item_price ON item(price);
CREATE INDEX idx_item_created_at ON item(created_at);