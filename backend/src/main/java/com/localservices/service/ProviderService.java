package com.localservices.service;

import com.localservices.dto.ProviderDTO;
import com.localservices.dto.ServiceDTO;
import com.localservices.entity.Provider;
import com.localservices.entity.ServiceItem;
import com.localservices.entity.ServiceCategory;
import com.localservices.repository.ProviderRepository;
import com.localservices.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProviderService {

    private final ProviderRepository providerRepository;
    private final ServiceRepository serviceRepository;

    public List<ProviderDTO> getAllProviders() {
        return providerRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ProviderDTO> getVerifiedProviders() {
        return providerRepository.findByIsVerifiedTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ProviderDTO> getProvidersByCategory(ServiceCategory category) {
        return providerRepository.findByServiceCategory(category).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ProviderDTO getProviderById(Long id) {
        Provider provider = providerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Provider not found"));
        return mapToDTO(provider);
    }

    public ProviderDTO getProviderByUserId(Long userId) {
        Provider provider = providerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Provider not found"));
        return mapToDTO(provider);
    }

    public List<ProviderDTO> getNearbyProviders(Double lat, Double lng, Double radiusKm) {
        double latDelta = radiusKm / 111.0;
        double lngDelta = radiusKm / (111.0 * Math.cos(Math.toRadians(lat)));

        return providerRepository.findNearbyProviders(null,
                lat - latDelta,
                lat + latDelta,
                lng - lngDelta,
                lng + lngDelta).stream().map(provider -> {
                    ProviderDTO dto = mapToDTO(provider);
                    dto.setDistance(calculateDistance(lat, lng, provider.getLatitude(), provider.getLongitude()));
                    return dto;
                })
                .sorted(Comparator.comparingDouble(p -> Objects.requireNonNullElse(p.getDistance(), Double.MAX_VALUE)))
                .collect(Collectors.toList());
    }

    private Double calculateDistance(Double lat1, Double lon1, Double lat2, Double lon2) {
        if (lat1 == null || lon1 == null || lat2 == null || lon2 == null)
            return null;
        final int R = 6371; // Radius of the earth
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                        * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c * 100.0) / 100.0; // Round to 2 decimal places
    }

    public List<ProviderDTO> getTopRatedProviders() {
        return providerRepository.findTopRatedProviders().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProviderDTO createProvider(ProviderDTO dto) {
        Provider provider = Provider.builder()
                .businessName(dto.getBusinessName())
                .description(dto.getDescription())
                .serviceCategory(dto.getServiceCategory())
                .hourlyRate(dto.getHourlyRate())
                .address(dto.getAddress())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .workingHours(dto.getWorkingHours())
                .serviceAreas(dto.getServiceAreas())
                .profileImage(dto.getProfileImage())
                .coverImage(dto.getCoverImage())
                .phone(dto.getPhone())
                .availability(dto.getAvailability())
                .isVerified(dto.getIsVerified() != null ? dto.getIsVerified() : false)
                .build();

        provider = providerRepository.save(provider);
        return mapToDTO(provider);
    }

    @Transactional
    public ProviderDTO updateProvider(Long id, ProviderDTO dto) {
        Provider provider = providerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        if (dto.getBusinessName() != null)
            provider.setBusinessName(dto.getBusinessName());
        if (dto.getDescription() != null)
            provider.setDescription(dto.getDescription());
        if (dto.getServiceCategory() != null)
            provider.setServiceCategory(dto.getServiceCategory());
        if (dto.getHourlyRate() != null)
            provider.setHourlyRate(dto.getHourlyRate());
        if (dto.getAddress() != null)
            provider.setAddress(dto.getAddress());
        if (dto.getLatitude() != null)
            provider.setLatitude(dto.getLatitude());
        if (dto.getLongitude() != null)
            provider.setLongitude(dto.getLongitude());
        if (dto.getWorkingHours() != null)
            provider.setWorkingHours(dto.getWorkingHours());
        if (dto.getServiceAreas() != null)
            provider.setServiceAreas(dto.getServiceAreas());
        if (dto.getProfileImage() != null)
            provider.setProfileImage(dto.getProfileImage());
        if (dto.getCoverImage() != null)
            provider.setCoverImage(dto.getCoverImage());
        if (dto.getPhone() != null)
            provider.setPhone(dto.getPhone());
        if (dto.getAvailability() != null)
            provider.setAvailability(dto.getAvailability());

        provider = providerRepository.save(provider);
        return mapToDTO(provider);
    }

    @Transactional
    public ProviderDTO verifyProvider(Long id, boolean verified) {
        Provider provider = providerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        provider.setIsVerified(verified);
        provider = providerRepository.save(provider);
        return mapToDTO(provider);
    }

    // Service Management
@Transactional(readOnly = true)
public List<ServiceDTO> getProviderServices(Long providerId) {

        return serviceRepository.findByProviderId(providerId).stream()
                .map(this::mapServiceToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ServiceDTO createService(Long providerId, ServiceDTO dto) {
        Provider provider = providerRepository.findById(providerId)
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        ServiceItem service = ServiceItem.builder()
                .provider(provider)
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .durationMinutes(dto.getDurationMinutes())
                .category(dto.getCategory())
                .isActive(true)
                .build();

        service = serviceRepository.save(service);
        return mapServiceToDTO(service);
    }

    @Transactional
    public ServiceDTO updateService(Long id, ServiceDTO dto) {
        ServiceItem service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        if (dto.getName() != null)
            service.setName(dto.getName());
        if (dto.getDescription() != null)
            service.setDescription(dto.getDescription());
        if (dto.getPrice() != null)
            service.setPrice(dto.getPrice());
        if (dto.getDurationMinutes() != null)
            service.setDurationMinutes(dto.getDurationMinutes());
        if (dto.getCategory() != null)
            service.setCategory(dto.getCategory());

        service = serviceRepository.save(service);
        return mapServiceToDTO(service);
    }

    @Transactional
    public void deleteProvider(Long id) {
        providerRepository.deleteById(id);
    }

    @Transactional
    public void deleteService(Long id) {
        serviceRepository.deleteById(id);
    }

    private ProviderDTO mapToDTO(Provider provider) {
        return ProviderDTO.builder()
                .id(provider.getId())
                .userId(provider.getUser().getId())
                .businessName(provider.getBusinessName())
                .description(provider.getDescription())
                .serviceCategory(provider.getServiceCategory())
                .hourlyRate(provider.getHourlyRate())
                .rating(provider.getRating())
                .totalReviews(provider.getTotalReviews())
                .isVerified(provider.getIsVerified())
                .address(provider.getAddress())
                .latitude(provider.getLatitude())
                .longitude(provider.getLongitude())
                .workingHours(provider.getWorkingHours())
                .serviceAreas(provider.getServiceAreas())
                .profileImage(provider.getProfileImage())
                .coverImage(provider.getCoverImage())
                .phone(provider.getPhone())
                .availability(provider.getAvailability())
                .experience(provider.getExperience())
                .build();
    }

    private ServiceDTO mapServiceToDTO(ServiceItem service) {
        return ServiceDTO.builder()
                .id(service.getId())
                .providerId(service.getProvider().getId())
                .providerName(service.getProvider().getBusinessName())
                .name(service.getName())
                .description(service.getDescription())
                .price(service.getPrice())
                .durationMinutes(service.getDurationMinutes())
                .category(service.getCategory())
                .isActive(service.getIsActive())
                .build();
    }
}
