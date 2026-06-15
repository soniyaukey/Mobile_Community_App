package com.localservices.controller;

import com.localservices.dto.ProviderDTO;
import com.localservices.dto.UserDTO;
import com.localservices.repository.BookingRepository;
import com.localservices.repository.ProviderRepository;
import com.localservices.repository.UserRepository;
import com.localservices.service.ProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final ProviderRepository providerRepository;
    private final BookingRepository bookingRepository;
    private final ProviderService providerService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        long totalUsers = userRepository.count();
        long totalProviders = providerRepository.count();
        long totalBookings = bookingRepository.count();

        return ResponseEntity.ok(Map.of(
                "totalUsers", totalUsers,
                "totalProviders", totalProviders,
                "totalBookings", totalBookings,
                "activeProviders", providerRepository.findByIsVerifiedTrue().size()));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll().stream()
                .map(user -> UserDTO.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .name(user.getName())
                        .phone(user.getPhone())
                        .role(user.getRole())
                        .build())
                .collect(Collectors.toList()));
    }

    @GetMapping("/providers/pending")
    public ResponseEntity<List<ProviderDTO>> getPendingProviders() {
        return ResponseEntity.ok(providerRepository.findByIsVerifiedFalse().stream()
                .map(provider -> ProviderDTO.builder()
                        .id(provider.getId())
                        .userId(provider.getUser().getId())
                        .businessName(provider.getBusinessName())
                        .description(provider.getDescription())
                        .serviceCategory(provider.getServiceCategory())
                        .isVerified(provider.getIsVerified())
                        .rating(provider.getRating())
                        .totalReviews(provider.getTotalReviews())
                        .build())
                .collect(Collectors.toList()));
    }

    @PutMapping("/providers/{id}/verify")
    public ResponseEntity<ProviderDTO> verifyProvider(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> request) {
        return ResponseEntity.ok(providerService.verifyProvider(id, request.get("verified")));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<Void> toggleUserStatus(@PathVariable Long id) {
        var user = userRepository.findById(id).orElseThrow();
        user.setIsActive(!user.getIsActive());
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    // Provider Management
    @PostMapping("/providers")
    public ResponseEntity<ProviderDTO> createProvider(@RequestBody ProviderDTO dto) {
        return ResponseEntity.ok(providerService.createProvider(dto));
    }

    @PutMapping("/providers/{id}")
    public ResponseEntity<ProviderDTO> updateProvider(@PathVariable Long id, @RequestBody ProviderDTO dto) {
        return ResponseEntity.ok(providerService.updateProvider(id, dto));
    }

    @DeleteMapping("/providers/{id}")
    public ResponseEntity<Void> deleteProvider(@PathVariable Long id) {
        providerService.deleteProvider(id);
        return ResponseEntity.ok().build();
    }
}
