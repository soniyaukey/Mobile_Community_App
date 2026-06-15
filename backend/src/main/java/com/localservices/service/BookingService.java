package com.localservices.service;

import com.localservices.dto.BookingDTO;
import com.localservices.entity.Booking;
import com.localservices.entity.BookingStatus;
import com.localservices.entity.PaymentStatus;
import com.localservices.entity.Provider;
import com.localservices.entity.ServiceItem;
import com.localservices.entity.User;
import com.localservices.repository.BookingRepository;
import com.localservices.repository.ProviderRepository;
import com.localservices.repository.ServiceRepository;
import com.localservices.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ProviderRepository providerRepository;
    private final ServiceRepository serviceRepository;
    
    @Transactional(readOnly = true)
    public List<BookingDTO> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingDTO> getProviderBookings(Long providerId) {
        return bookingRepository.findByProviderId(providerId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingDTO> getUserBookingsByStatus(Long userId, BookingStatus status) {
        return bookingRepository.findByUserIdAndBookingStatus(userId, status).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingDTO> getProviderBookingsByStatus(Long providerId, BookingStatus status) {
        return bookingRepository.findByProviderIdAndBookingStatus(providerId, status).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return mapToDTO(booking);
    }
    
    @Transactional
    public BookingDTO createBooking(BookingDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Provider provider = providerRepository.findById(dto.getProviderId())
                .orElseThrow(() -> new RuntimeException("Provider not found"));
        ServiceItem service = serviceRepository.findById(dto.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));
        
        Booking booking = Booking.builder()
                .user(user)
                .provider(provider)
                .service(service)
                .bookingStatus(BookingStatus.PENDING)
                .scheduledDate(dto.getScheduledDate())
                .scheduledTime(dto.getScheduledTime())
                .totalAmount(dto.getTotalAmount())
                .paymentStatus(PaymentStatus.PENDING)
                .notes(dto.getNotes())
                .address(dto.getAddress())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .build();
        
        booking = bookingRepository.save(booking);
        return mapToDTO(booking);
    }
    
    @Transactional
    public BookingDTO updateBookingStatus(Long id, BookingStatus status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setBookingStatus(status);
        booking = bookingRepository.save(booking);
        return mapToDTO(booking);
    }
    
    @Transactional
    public BookingDTO processPayment(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setPaymentStatus(PaymentStatus.PAID);
        booking = bookingRepository.save(booking);
        return mapToDTO(booking);
    }
    
    public Double getProviderEarnings(Long providerId) {
        Double earnings = bookingRepository.getTotalEarningsByProvider(providerId);
        return earnings != null ? earnings : 0.0;
    }
    
    public Long getProviderTotalBookings(Long providerId) {
        return bookingRepository.getTotalBookingsByProvider(providerId);
    }
    
    private BookingDTO mapToDTO(Booking booking) {
        return BookingDTO.builder()
                .id(booking.getId())
                .userId(booking.getUser().getId())
                .userName(booking.getUser().getName())
                .providerId(booking.getProvider().getId())
                .providerName(booking.getProvider().getBusinessName())
                .serviceId(booking.getService().getId())
                .serviceName(booking.getService().getName())
                .status(booking.getBookingStatus())
                .scheduledDate(booking.getScheduledDate())
                .scheduledTime(booking.getScheduledTime())
                .totalAmount(booking.getTotalAmount())
                .paymentStatus(booking.getPaymentStatus())
                .notes(booking.getNotes())
                .address(booking.getAddress())
                .latitude(booking.getLatitude())
                .longitude(booking.getLongitude())
                .build();
    }
}
