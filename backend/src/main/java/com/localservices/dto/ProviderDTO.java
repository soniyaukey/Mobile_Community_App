package com.localservices.dto;

import com.localservices.entity.ServiceCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProviderDTO {
    private Long id;
    private Long userId;
    private String businessName;
    private String description;
    private ServiceCategory serviceCategory;
    private Double hourlyRate;
    private Double rating;
    private Integer totalReviews;
    private Boolean isVerified;
    private String phone;
    private String availability;
    private String address;
    private Double latitude;
    private Double longitude;
    private String workingHours;
    private String serviceAreas;
    private String profileImage;
    private String coverImage;
    private String experience;
    private Double distance;
}
