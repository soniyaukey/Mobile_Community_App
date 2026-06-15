package com.localservices.repository;

import com.localservices.entity.Provider;
import com.localservices.entity.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProviderRepository extends JpaRepository<Provider, Long> {
    Optional<Provider> findByUserId(Long userId);
    List<Provider> findByIsVerifiedTrue();
    List<Provider> findByIsVerifiedFalse();
    List<Provider> findByServiceCategory(ServiceCategory category);
    
    @Query("SELECT p FROM Provider p WHERE p.isVerified = true AND " +
           "(p.serviceCategory = :category OR :category IS NULL) " +
           "AND ((p.latitude BETWEEN :minLat AND :maxLat) " +
           "AND (p.longitude BETWEEN :minLng AND :maxLng))")
    List<Provider> findNearbyProviders(
            @Param("category") ServiceCategory category,
            @Param("minLat") Double minLat,
            @Param("maxLat") Double maxLat,
            @Param("minLng") Double minLng,
            @Param("maxLng") Double maxLng
    );
    
    @Query("SELECT p FROM Provider p WHERE p.isVerified = true ORDER BY p.rating DESC")
    List<Provider> findTopRatedProviders();
}
