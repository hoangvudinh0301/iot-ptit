package com.example.iot.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import com.example.iot.entity.History;
public interface HistoryRepository extends JpaRepository<History, Integer>, JpaSpecificationExecutor<History>{

    Optional<History> findFirstByDevice_IdAndStatusOrderByCreatedAtDesc(
        Integer deviceId,
        String status
    );
    Optional<History> findFirstByDevice_IdOrderByCreatedAtDesc(
        Integer deviceId
    );
    List<History> findByStatusAndCreatedAtBefore(
        String status,
        LocalDateTime createdAt
    );
} 
