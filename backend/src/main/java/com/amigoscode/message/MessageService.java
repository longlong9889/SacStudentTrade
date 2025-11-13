package com.amigoscode.message;

import com.amigoscode.customer.Customer;
import com.amigoscode.customer.CustomerRepository;
import com.amigoscode.exception.ResourceNotFoundException;
import com.amigoscode.item.Item;
import com.amigoscode.item.ItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final CustomerRepository customerRepository;
    private final ItemRepository itemRepository;
    private final MessageDTOMapper messageDTOMapper;

    public MessageService(MessageRepository messageRepository,
                          CustomerRepository customerRepository,
                          ItemRepository itemRepository,
                          MessageDTOMapper messageDTOMapper) {
        this.messageRepository = messageRepository;
        this.customerRepository = customerRepository;
        this.itemRepository = itemRepository;
        this.messageDTOMapper = messageDTOMapper;
    }

    public List<MessageDTO> getAllMessagesForUser(Integer userId) {
        if (!customerRepository.existsById(userId)) {
            throw new ResourceNotFoundException(
                    "User with id [%s] not found".formatted(userId)
            );
        }
        return messageRepository.findAllByUserId(userId)
                .stream()
                .map(messageDTOMapper)
                .collect(Collectors.toList());
    }

    public List<MessageDTO> getConversation(Integer userId1, Integer userId2) {
        if (!customerRepository.existsById(userId1)) {
            throw new ResourceNotFoundException(
                    "User with id [%s] not found".formatted(userId1)
            );
        }
        if (!customerRepository.existsById(userId2)) {
            throw new ResourceNotFoundException(
                    "User with id [%s] not found".formatted(userId2)
            );
        }
        return messageRepository.findConversationBetweenUsers(userId1, userId2)
                .stream()
                .map(messageDTOMapper)
                .collect(Collectors.toList());
    }

    public List<MessageDTO> getUnreadMessages(Integer userId) {
        if (!customerRepository.existsById(userId)) {
            throw new ResourceNotFoundException(
                    "User with id [%s] not found".formatted(userId)
            );
        }
        return messageRepository.findUnreadMessagesByUserId(userId)
                .stream()
                .map(messageDTOMapper)
                .collect(Collectors.toList());
    }

    public Long getUnreadMessageCount(Integer userId) {
        if (!customerRepository.existsById(userId)) {
            throw new ResourceNotFoundException(
                    "User with id [%s] not found".formatted(userId)
            );
        }
        return messageRepository.countUnreadMessagesByUserId(userId);
    }

    @Transactional
    public MessageDTO sendMessage(Integer senderId, MessageRequest request) {
        Customer sender = customerRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Sender with id [%s] not found".formatted(senderId)
                ));

        Customer receiver = customerRepository.findById(request.receiverId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Receiver with id [%s] not found".formatted(request.receiverId())
                ));

        Item item = null;
        if (request.itemId() != null) {
            item = itemRepository.findById(request.itemId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Item with id [%s] not found".formatted(request.itemId())
                    ));
        }

        Message message = new Message(sender, receiver, item, request.content());
        Message savedMessage = messageRepository.save(message);
        return messageDTOMapper.apply(savedMessage);
    }

    @Transactional
    public void markAsRead(Integer messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Message with id [%s] not found".formatted(messageId)
                ));
        message.setIsRead(true);
        messageRepository.save(message);
    }

    @Transactional
    public void markAllAsRead(Integer userId, Integer otherUserId) {
        List<Message> messages = messageRepository.findConversationBetweenUsers(userId, otherUserId);
        messages.stream()
                .filter(m -> m.getReceiver().getId().equals(userId) && !m.getIsRead())
                .forEach(m -> m.setIsRead(true));
        messageRepository.saveAll(messages);
    }

    public void deleteMessage(Integer messageId) {
        if (!messageRepository.existsById(messageId)) {
            throw new ResourceNotFoundException(
                    "Message with id [%s] not found".formatted(messageId)
            );
        }
        messageRepository.deleteById(messageId);
    }
}