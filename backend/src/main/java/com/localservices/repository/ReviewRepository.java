package com.localservices.repository;

import com.localservices.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("SELECT r FROM Review r JOIN FETCH r.user JOIN FETCH r.provider LEFT JOIN FETCH r.booking WHERE r.provider.id = :providerId")
    List<Review> findByProviderId(@Param("providerId") Long providerId);

    @Query("SELECT r FROM Review r JOIN FETCH r.user JOIN FETCH r.provider LEFT JOIN FETCH r.booking WHERE r.user.id = :userId")
    List<Review> findByUserId(@Param("userId") Long userId);

    Optional<Review> findByBookingId(Long bookingId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.provider.id = :providerId")
    Double getAverageRatingByProvider(@Param("providerId") Long providerId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.provider.id = :providerId")
    Long getReviewCountByProvider(@Param("providerId") Long providerId);
}
