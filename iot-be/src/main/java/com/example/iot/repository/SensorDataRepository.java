package com.example.iot.repository;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.iot.entity.SensorData;

public interface SensorDataRepository extends JpaRepository<SensorData, Integer>{

    Page<SensorData> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);

    @Query ("""
        SELECT sd FROM SensorData sd
        WHERE sd.sensor.type = :type
        ORDER BY sd.createdAt DESC
    """)
    List<SensorData> findLatesBySensorType(@Param("type") String type);

    @Query("""
        SELECT sd FROM SensorData sd
        WHERE LOWER(sd.sensor.type)
        LIKE LOWER(CONCAT('%', :type, '%'))    
        AND sd.value = :value
    """)
    Page<SensorData> searchSensorDataBySensorValue(@Param("type") String type, @Param("value") Double valye, Pageable pageable);
    List<SensorData> findTop30ByOrderByCreatedAtDesc();
}
