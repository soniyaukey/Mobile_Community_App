package com.localservices.repository;

import com.localservices.entity.Booking;
import com.localservices.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b FROM Booking b JOIN FETCH b.user JOIN FETCH b.provider JOIN FETCH b.service WHERE b.user.id = :userId ORDER BY b.id DESC")
    List<Booking> findByUserId(@Param("userId") Long userId);

    @Query("SELECT b FROM Booking b JOIN FETCH b.user JOIN FETCH b.provider JOIN FETCH b.service WHERE b.provider.id = :providerId ORDER BY b.id DESC")
    List<Booking> findByProviderId(@Param("providerId") Long providerId);

    @Query("SELECT b FROM Booking b JOIN FETCH b.user JOIN FETCH b.provider JOIN FETCH b.service WHERE b.user.id = :userId AND b.bookingStatus = :status ORDER BY b.id DESC")
    List<Booking> findByUserIdAndBookingStatus(@Param("userId") Long userId, @Param("status") BookingStatus status);

    @Query("SELECT b FROM Booking b JOIN FETCH b.user JOIN FETCH b.provider JOIN FETCH b.service WHERE b.provider.id = :providerId AND b.bookingStatus = :status ORDER BY b.id DESC")
    List<Booking> findByProviderIdAndBookingStatus(@Param("providerId") Long providerId, @Param("status") BookingStatus status);

    @Query("SELECT b FROM Booking b JOIN FETCH b.user JOIN FETCH b.provider JOIN FETCH b.service WHERE b.id = :id")
    Optional<Booking> findByIdWithDetails(@Param("id") Long id);

    @Query("SELECT SUM(b.totalAmount) FROM Booking b WHERE b.provider.id = :providerId AND b.paymentStatus = 'PAID'")
    Double getTotalEarningsByProvider(@Param("providerId") Long providerId);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.provider.id = :providerId")
    Long getTotalBookingsByProvider(@Param("providerId") Long providerId);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.provider.id = :providerId AND b.bookingStatus = :status")
    Long getBookingsCountByStatus(@Param("providerId") Long providerId, @Param("status") BookingStatus status);
}
