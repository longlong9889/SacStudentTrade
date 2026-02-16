-- Create message table
CREATE TABLE message (
                         id BIGSERIAL PRIMARY KEY,
                         sender_id BIGINT NOT NULL,
                         receiver_id BIGINT NOT NULL,
                         item_id BIGINT,
                         content VARCHAR(2000) NOT NULL,
                         is_read BOOLEAN NOT NULL DEFAULT FALSE,
                         created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         CONSTRAINT fk_message_sender FOREIGN KEY (sender_id) REFERENCES customer(id) ON DELETE CASCADE,
                         CONSTRAINT fk_message_receiver FOREIGN KEY (receiver_id) REFERENCES customer(id) ON DELETE CASCADE,
                         CONSTRAINT fk_message_item FOREIGN KEY (item_id) REFERENCES item(id) ON DELETE SET NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_message_sender_id ON message(sender_id);
CREATE INDEX idx_message_receiver_id ON message(receiver_id);
CREATE INDEX idx_message_item_id ON message(item_id);
CREATE INDEX idx_message_is_read ON message(is_read);
CREATE INDEX idx_message_created_at ON message(created_at);