package com.example.iot.repository;
import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.iot.entity.History;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface HistoryRepository extends JpaRepository<History, Integer>{
    @Query("""
        SELECT h FROM History h
        WHERE LOWER(h.device.name)
        LIKE  LOWER(CONCAT('%', :keyword, '%'))   
    """)
    Page<History> searchHistoryByDeviceName(@Param("keyword") String deviceName, Pageable pageable);

    Page<History> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);

} 
