package com.localservices.service;

import com.localservices.dto.ReviewDTO;
import com.localservices.entity.Booking;
import com.localservices.entity.BookingStatus;
import com.localservices.entity.Provider;
import com.localservices.entity.Review;
import com.localservices.entity.User;
import com.localservices.repository.BookingRepository;
import com.localservices.repository.ProviderRepository;
import com.localservices.repository.ReviewRepository;
import com.localservices.repository.UserRepository;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {
    
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ProviderRepository providerRepository;
    private final BookingRepository bookingRepository;
    
@Transactional(readOnly = true)
public List<ReviewDTO> getProviderReviews(Long providerId) {

        return reviewRepository.findByProviderId(providerId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
@Transactional(readOnly = true)
public List<ReviewDTO> getUserReviews(Long userId) {

        return reviewRepository.findByUserId(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public ReviewDTO createReview(ReviewDTO dto) {
        User user = userRepository.findById(Objects.requireNonNull(dto.getUserId()))
                .orElseThrow(() -> new RuntimeException("User not found"));
        Provider provider = providerRepository.findById(Objects.requireNonNull(dto.getProviderId()))
                .orElseThrow(() -> new RuntimeException("Provider not found"));
        
        Booking booking = null;
        if (dto.getBookingId() != null) {
            Long bookingId = Objects.requireNonNull(dto.getBookingId());
            booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));
            if (booking.getBookingStatus() != BookingStatus.COMPLETED) {
                throw new RuntimeException("Can only review completed bookings");
            }
        }
        
        Review review = Review.builder()
                .booking(booking)
                .user(user)
                .provider(provider)
                .rating(dto.getRating())
                .comment(dto.getComment())
                .build();
        
        review = reviewRepository.save(review);
        
        // Update provider rating
        updateProviderRating(Objects.requireNonNull(provider.getId()));
        
        return mapToDTO(review);
    }
    
    private void updateProviderRating(Long providerId) {
        Double avgRating = reviewRepository.getAverageRatingByProvider(Objects.requireNonNull(providerId));
        Long reviewCount = reviewRepository.getReviewCountByProvider(Objects.requireNonNull(providerId));
        
        Provider provider = providerRepository.findById(providerId)
                .orElseThrow(() -> new RuntimeException("Provider not found"));
        
        provider.setRating(avgRating != null ? avgRating : 0.0);
        provider.setTotalReviews(reviewCount != null ? reviewCount.intValue() : 0);
        
        providerRepository.save(provider);
    }
    
    private ReviewDTO mapToDTO(Review review) {
        return ReviewDTO.builder()
                .id(review.getId())
                .bookingId(review.getBooking() != null ? review.getBooking().getId() : null)
                .userId(review.getUser().getId())
                .userName(review.getUser().getName())
                .providerId(review.getProvider().getId())
                .providerName(review.getProvider().getBusinessName())
                .rating(review.getRating())
                .comment(review.getComment())
                .build();
    }
}
