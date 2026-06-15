package com.localservices.repository;

import com.localservices.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m JOIN FETCH m.sender JOIN FETCH m.messageReceiver LEFT JOIN FETCH m.booking WHERE m.booking.id = :bookingId ORDER BY m.createdAt ASC")
    List<Message> findByBookingId(@Param("bookingId") Long bookingId);

    @Query("SELECT m FROM Message m JOIN FETCH m.sender JOIN FETCH m.messageReceiver LEFT JOIN FETCH m.booking " +
           "WHERE (m.sender.id = :userId1 AND m.messageReceiver.id = :userId2) " +
           "OR (m.sender.id = :userId2 AND m.messageReceiver.id = :userId1) ORDER BY m.createdAt ASC")
    List<Message> findConversation(@Param("userId1") Long userId1, @Param("userId2") Long userId2);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.messageReceiver.id = :userId AND m.isRead = false")
    Long getUnreadMessageCount(@Param("userId") Long userId);
}
