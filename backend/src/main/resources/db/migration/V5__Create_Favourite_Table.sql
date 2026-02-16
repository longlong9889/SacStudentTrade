-- Create favorite table
CREATE TABLE favorite (
                          id BIGSERIAL PRIMARY KEY,
                          customer_id BIGINT NOT NULL,
                          item_id BIGINT NOT NULL,
                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          CONSTRAINT fk_favorite_customer FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE,
                          CONSTRAINT fk_favorite_item FOREIGN KEY (item_id) REFERENCES item(id) ON DELETE CASCADE,
                          CONSTRAINT favorite_customer_item_unique UNIQUE (customer_id, item_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_favorite_customer_id ON favorite(customer_id);
CREATE INDEX idx_favorite_item_id ON favorite(item_id);
CREATE INDEX idx_favorite_created_at ON favorite(created_at);