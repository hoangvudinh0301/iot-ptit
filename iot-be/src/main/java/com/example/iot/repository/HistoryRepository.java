package com.example.iot.repository;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.example.iot.entity.History;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface HistoryRepository extends JpaRepository<History, Integer>, JpaSpecificationExecutor<History>{

    Optional<History> findFirstByDevice_IdAndStatusOrderByCreatedAtDesc(
        Integer deviceId,
        String status
    );
    Optional<History> findFirstByDevice_IdOrderByCreatedAtDesc(
        Integer deviceId
    );
} 
