package com.localservices.repository;

import com.localservices.entity.ServiceItem;
import com.localservices.entity.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceItem, Long> {
    List<ServiceItem> findByProviderId(Long providerId);
    List<ServiceItem> findByProviderIdAndIsActiveTrue(Long providerId);
    List<ServiceItem> findByCategory(ServiceCategory category);
}
