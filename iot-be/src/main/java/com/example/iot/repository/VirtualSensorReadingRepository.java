package com.example.iot.repository;

import com.example.iot.entity.VirtualSensorReading;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VirtualSensorReadingRepository extends JpaRepository<VirtualSensorReading, Long> {
    Optional<VirtualSensorReading> findTopBySensorTypeOrderByRecordedAtDesc(String sensorType);

    long countBySensorTypeAndRecordedAtGreaterThanEqualAndRecordedAtLessThan(
        String sensorType, LocalDateTime start, LocalDateTime end);

    long countBySensorTypeAndExceededTrueAndRecordedAtGreaterThanEqualAndRecordedAtLessThan(
        String sensorType, LocalDateTime start, LocalDateTime end);
}
