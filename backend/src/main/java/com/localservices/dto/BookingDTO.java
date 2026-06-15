package com.localservices.dto;

import com.localservices.entity.BookingStatus;
import com.localservices.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingDTO {
    private Long id;
    private Long userId;
    private String userName;
    private Long providerId;
    private String providerName;
    private Long serviceId;
    private String serviceName;
    private BookingStatus status;
    private LocalDate scheduledDate;
    private LocalTime scheduledTime;
    private BigDecimal totalAmount;
    private PaymentStatus paymentStatus;
    private String notes;
    private String address;
    private Double latitude;
    private Double longitude;
}
