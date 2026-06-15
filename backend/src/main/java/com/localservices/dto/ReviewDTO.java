package com.localservices.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDTO {
    private Long id;
    private Long bookingId;
    private Long userId;
    private String userName;
    private Long providerId;
    private String providerName;
    private Integer rating;
    private String comment;
}
