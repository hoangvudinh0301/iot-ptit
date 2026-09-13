package com.example.iot.repository;
import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.iot.entity.SensorData;

public interface SensorDataRepository extends JpaRepository<SensorData, Integer>{

    @Query("""
        SELECT sd FROM SensorData sd
        WHERE LOWER(sd.sensor.name)
        LIKE LOWER(CONCAT('%', :keyword, '%'))
    """)
    Page<SensorData> searchSensorDataBySensorName(@Param("keyword") String sensorName, Pageable pageable);
    
    Page<SensorData> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);
}
