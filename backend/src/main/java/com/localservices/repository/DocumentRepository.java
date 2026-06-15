package com.localservices.repository;

import com.localservices.entity.Document;
import com.localservices.entity.DocumentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByProviderId(Long providerId);
    List<Document> findByProviderIdAndStatus(Long providerId, DocumentStatus status);
}
