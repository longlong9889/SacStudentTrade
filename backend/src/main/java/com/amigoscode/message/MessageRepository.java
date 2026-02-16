package com.amigoscode.message;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    // Get all messages for a user (sent or received)
    @Query("SELECT m FROM Message m WHERE m.sender.id = :userId OR m.receiver.id = :userId ORDER BY m.createdAt DESC")
    List<Message> findAllByUserId(@Param("userId") Integer userId);

    // Get conversation between two users
    @Query("SELECT m FROM Message m WHERE " +
            "(m.sender.id = :userId1 AND m.receiver.id = :userId2) OR " +
            "(m.sender.id = :userId2 AND m.receiver.id = :userId1) " +
            "ORDER BY m.createdAt ASC")
    List<Message> findConversationBetweenUsers(@Param("userId1") Integer userId1,
                                               @Param("userId2") Integer userId2);

    // Get messages about specific item
    @Query("SELECT m FROM Message m WHERE m.item.id = :itemId ORDER BY m.createdAt DESC")
    List<Message> findByItemId(@Param("itemId") Long itemId);

    // Get unread messages for a user
    @Query("SELECT m FROM Message m WHERE m.receiver.id = :userId AND m.isRead = false ORDER BY m.createdAt DESC")
    List<Message> findUnreadMessagesByUserId(@Param("userId") Integer userId);

    // Count unread messages for a user
    @Query("SELECT COUNT(m) FROM Message m WHERE m.receiver.id = :userId AND m.isRead = false")
    Long countUnreadMessagesByUserId(@Param("userId") Integer userId);
}