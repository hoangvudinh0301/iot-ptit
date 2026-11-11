
package com.example.iot.repository;

import com.example.iot.entity.BlinkEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface BlinkEventRepository
        extends JpaRepository<BlinkEvent, Long> {

    long countByDeviceId(Integer deviceId);

    long countByDeviceIdAndOccurredAtGreaterThanEqual(
            Integer deviceId,
            LocalDateTime start
    );

    List<BlinkEvent>
    findAllByOccurredAtGreaterThanEqualOrderByOccurredAtDesc(
            LocalDateTime start
    );

    List<BlinkEvent> findTop20ByOrderByOccurredAtDesc();
}
