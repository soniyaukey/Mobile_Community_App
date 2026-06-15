package com.localservices.service;

import com.localservices.dto.AuthRequest;
import com.localservices.dto.AuthResponse;
import com.localservices.dto.UserDTO;
import com.localservices.entity.Provider;
import com.localservices.entity.User;
import com.localservices.entity.UserRole;
import com.localservices.repository.ProviderRepository;
import com.localservices.repository.UserRepository;
import com.localservices.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final ProviderRepository providerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    
    @Transactional
    public AuthResponse register(AuthRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .phone(request.getPhone())
                .address(request.getAddress())
                .role(request.getRole() != null ? request.getRole() : UserRole.USER)
                .isActive(true)
                .build();
        
        user = userRepository.save(user);
        
        Long providerId = null;
        if (user.getRole() == UserRole.PROVIDER) {
            Provider provider = Provider.builder()
                    .user(user)
                    .businessName(request.getName() + "'s Services")
                    .isVerified(false)
                    .rating(0.0)
                    .totalReviews(0)
                    .build();
            provider = providerRepository.save(provider);
            providerId = provider.getId();
        }
        
        String token = tokenProvider.generateTokenFromUsername(user.getEmail());
        
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .providerId(providerId)
                .build();
    }
    
    public AuthResponse login(String email, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String token = tokenProvider.generateToken(authentication);
        
        Long providerId = null;
        if (user.getRole() == UserRole.PROVIDER) {
            Provider provider = providerRepository.findByUserId(user.getId()).orElse(null);
            if (provider != null) {
                providerId = provider.getId();
            }
        }
        
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .providerId(providerId)
                .build();
    }
    
    public UserDTO getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .phone(user.getPhone())
                .address(user.getAddress())
                .latitude(user.getLatitude())
                .longitude(user.getLongitude())
                .role(user.getRole())
                .profileImage(user.getProfileImage())
                .build();
    }
    
    @Transactional
    public UserDTO updateProfile(String email, UserDTO userDTO) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (userDTO.getName() != null) user.setName(userDTO.getName());
        if (userDTO.getPhone() != null) user.setPhone(userDTO.getPhone());
        if (userDTO.getAddress() != null) user.setAddress(userDTO.getAddress());
        if (userDTO.getLatitude() != null) user.setLatitude(userDTO.getLatitude());
        if (userDTO.getLongitude() != null) user.setLongitude(userDTO.getLongitude());
        if (userDTO.getProfileImage() != null) user.setProfileImage(userDTO.getProfileImage());
        
        user = userRepository.save(user);
        
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .phone(user.getPhone())
                .address(user.getAddress())
                .latitude(user.getLatitude())
                .longitude(user.getLongitude())
                .role(user.getRole())
                .profileImage(user.getProfileImage())
                .build();
    }
}
