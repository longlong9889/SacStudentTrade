package com.amigoscode.message;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MessageDTO>> getAllMessagesForUser(
            @PathVariable("userId") Integer userId) {
        return ResponseEntity.ok(messageService.getAllMessagesForUser(userId));
    }

    @GetMapping("/conversation")
    public ResponseEntity<List<MessageDTO>> getConversation(
            @RequestParam("user1") Integer userId1,
            @RequestParam("user2") Integer userId2) {
        return ResponseEntity.ok(messageService.getConversation(userId1, userId2));
    }

    @GetMapping("/unread/{userId}")
    public ResponseEntity<List<MessageDTO>> getUnreadMessages(
            @PathVariable("userId") Integer userId) {
        return ResponseEntity.ok(messageService.getUnreadMessages(userId));
    }

    @GetMapping("/unread/count/{userId}")
    public ResponseEntity<Long> getUnreadMessageCount(
            @PathVariable("userId") Integer userId) {
        return ResponseEntity.ok(messageService.getUnreadMessageCount(userId));
    }

    @PostMapping("/send/{senderId}")
    public ResponseEntity<MessageDTO> sendMessage(
            @PathVariable("senderId") Integer senderId,
            @RequestBody MessageRequest request) {
        MessageDTO message = messageService.sendMessage(senderId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }

    @PatchMapping("/{messageId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable("messageId") Long messageId) {
        messageService.markAsRead(messageId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/mark-all-read")
    public ResponseEntity<Void> markAllAsRead(
            @RequestParam("userId") Integer userId,
            @RequestParam("otherUserId") Integer otherUserId) {
        messageService.markAllAsRead(userId, otherUserId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<Void> deleteMessage(@PathVariable("messageId") Long messageId) {
        messageService.deleteMessage(messageId);
        return ResponseEntity.noContent().build();
    }
}