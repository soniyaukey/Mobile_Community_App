package com.localservices.service;

import com.localservices.dto.MessageDTO;
import com.localservices.entity.Booking;
import com.localservices.entity.Message;
import com.localservices.entity.User;
import com.localservices.repository.BookingRepository;
import com.localservices.repository.MessageRepository;
import com.localservices.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {
    
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    
    @Transactional(readOnly = true)
    public List<MessageDTO> getConversation(Long userId1, Long userId2) {
        return messageRepository.findConversation(userId1, userId2).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MessageDTO> getBookingMessages(Long bookingId) {
        return messageRepository.findByBookingId(bookingId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public Long getUnreadCount(Long userId) {
        return messageRepository.getUnreadMessageCount(userId);
    }
    
    @Transactional
    public MessageDTO sendMessage(MessageDTO dto) {
        User sender = userRepository.findById(dto.getSenderId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(dto.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));
        
        Booking booking = null;
        if (dto.getBookingId() != null) {
            booking = bookingRepository.findById(dto.getBookingId()).orElse(null);
        }
        
        Message message = Message.builder()
                .sender(sender)
                .messageReceiver(receiver)
                .booking(booking)
                .content(dto.getContent())
                .messageType(dto.getMessageType() != null ? dto.getMessageType() : "TEXT")
                .isRead(false)
                .build();
        
        message = messageRepository.save(message);
        return mapToDTO(message);
    }
    
    @Transactional
    public void markAsRead(Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        message.setIsRead(true);
        messageRepository.save(message);
    }
    
    private MessageDTO mapToDTO(Message message) {
        return MessageDTO.builder()
                .id(message.getId())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getName())
                .receiverId(message.getMessageReceiver().getId())
                .receiverName(message.getMessageReceiver().getName())
                .bookingId(message.getBooking() != null ? message.getBooking().getId() : null)
                .content(message.getContent())
                .isRead(message.getIsRead())
                .messageType(message.getMessageType())
                .build();
    }
}
