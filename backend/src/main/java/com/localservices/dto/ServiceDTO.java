package com.localservices.dto;

import com.localservices.entity.ServiceCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceDTO {
    private Long id;
    private Long providerId;
    private String providerName;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer durationMinutes;
    private ServiceCategory category;
    private Boolean isActive;
}
