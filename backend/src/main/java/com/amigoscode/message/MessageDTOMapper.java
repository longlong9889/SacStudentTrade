package com.amigoscode.message;

import org.springframework.stereotype.Service;
import java.util.function.Function;

@Service
public class MessageDTOMapper implements Function<Message, MessageDTO> {

    @Override
    public MessageDTO apply(Message message) {
        return new MessageDTO(
                message.getId(),
                message.getSender().getId(),
                message.getSender().getName(),
                message.getReceiver().getId(),
                message.getReceiver().getName(),
                message.getItem() != null ? message.getItem().getId() : null,
                message.getItem() != null ? message.getItem().getTitle() : null,
                message.getContent(),
                message.getIsRead(),
                message.getCreatedAt()
        );
    }
}