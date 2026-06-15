package com.localservices.controller;

import com.localservices.dto.ProviderDTO;
import com.localservices.dto.ServiceDTO;
import com.localservices.entity.ServiceCategory;
import com.localservices.service.ProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/providers")
@RequiredArgsConstructor
public class ProviderController {

    private final ProviderService providerService;

    @GetMapping
    public ResponseEntity<List<ProviderDTO>> getAllProviders() {
        return ResponseEntity.ok(providerService.getAllProviders());
    }

    @GetMapping("/verified")
    public ResponseEntity<List<ProviderDTO>> getVerifiedProviders() {
        return ResponseEntity.ok(providerService.getVerifiedProviders());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProviderDTO>> getProvidersByCategory(
            @PathVariable ServiceCategory category) {
        return ResponseEntity.ok(providerService.getProvidersByCategory(category));
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<ProviderDTO>> getNearbyProviders(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(defaultValue = "10") Double radius) {
        return ResponseEntity.ok(providerService.getNearbyProviders(lat, lng, radius));
    }

    @GetMapping("/top-rated")
    public ResponseEntity<List<ProviderDTO>> getTopRatedProviders() {
        return ResponseEntity.ok(providerService.getTopRatedProviders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProviderDTO> getProviderById(@PathVariable Long id) {
        return ResponseEntity.ok(providerService.getProviderById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ProviderDTO> getProviderByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(providerService.getProviderByUserId(userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProviderDTO> updateProvider(
            @PathVariable Long id,
            @RequestBody ProviderDTO dto) {
        return ResponseEntity.ok(providerService.updateProvider(id, dto));
    }

    // Service Management
    @GetMapping("/{providerId}/services")
    public ResponseEntity<List<ServiceDTO>> getProviderServices(@PathVariable Long providerId) {
        return ResponseEntity.ok(providerService.getProviderServices(providerId));
    }

    @PostMapping("/{providerId}/services")
    public ResponseEntity<ServiceDTO> createService(
            @PathVariable Long providerId,
            @RequestBody ServiceDTO dto) {
        return ResponseEntity.ok(providerService.createService(providerId, dto));
    }

    @PutMapping("/services/{serviceId}")
    public ResponseEntity<ServiceDTO> updateService(
            @PathVariable Long serviceId,
            @RequestBody ServiceDTO dto) {
        return ResponseEntity.ok(providerService.updateService(serviceId, dto));
    }

    @DeleteMapping("/services/{serviceId}")
    public ResponseEntity<Void> deleteService(@PathVariable Long serviceId) {
        providerService.deleteService(serviceId);
        return ResponseEntity.ok().build();
    }
}
