package com.localservices.controller;

import com.localservices.dto.BookingDTO;
import com.localservices.entity.BookingStatus;
import com.localservices.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {
    
    private final BookingService bookingService;
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingDTO>> getUserBookings(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }
    
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<BookingDTO>> getProviderBookings(@PathVariable Long providerId) {
        return ResponseEntity.ok(bookingService.getProviderBookings(providerId));
    }
    
    @GetMapping("/user/{userId}/status/{status}")
    public ResponseEntity<List<BookingDTO>> getUserBookingsByStatus(
            @PathVariable Long userId,
            @PathVariable BookingStatus status) {
        return ResponseEntity.ok(bookingService.getUserBookingsByStatus(userId, status));
    }
    
    @GetMapping("/provider/{providerId}/status/{status}")
    public ResponseEntity<List<BookingDTO>> getProviderBookingsByStatus(
            @PathVariable Long providerId,
            @PathVariable BookingStatus status) {
        return ResponseEntity.ok(bookingService.getProviderBookingsByStatus(providerId, status));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }
    
    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(@RequestBody BookingDTO dto) {
        return ResponseEntity.ok(bookingService.createBooking(dto));
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<BookingDTO> updateBookingStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        BookingStatus status = BookingStatus.valueOf(request.get("status"));
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status));
    }
    
    @PostMapping("/{id}/payment")
    public ResponseEntity<BookingDTO> processPayment(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.processPayment(id));
    }
    
    @GetMapping("/provider/{providerId}/earnings")
    public ResponseEntity<Double> getProviderEarnings(@PathVariable Long providerId) {
        return ResponseEntity.ok(bookingService.getProviderEarnings(providerId));
    }
    
    @GetMapping("/provider/{providerId}/stats")
    public ResponseEntity<Map<String, Object>> getProviderStats(@PathVariable Long providerId) {
        return ResponseEntity.ok(Map.of(
            "totalBookings", bookingService.getProviderTotalBookings(providerId),
            "earnings", bookingService.getProviderEarnings(providerId),
            "pending", bookingService.getProviderBookingsByStatus(providerId, BookingStatus.PENDING),
            "completed", bookingService.getProviderBookingsByStatus(providerId, BookingStatus.COMPLETED)
        ));
    }
}
