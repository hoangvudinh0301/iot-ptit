package com.example.iot.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

/** One physical ESP32 sampling cycle per virtual sensor (not a LED blink). */
@Entity
@Table(name = "virtual_sensor_readings", indexes = {
    @Index(name = "idx_virtual_sensor_day", columnList = "sensor_type,recorded_at")
})
public class VirtualSensorReading {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sensor_type", nullable = false, length = 16)
    private String sensorType;

    @Column(nullable = false)
    private Integer value;

    @Column(nullable = false)
    private boolean exceeded;

    @Column(name = "recorded_at", nullable = false)
    private LocalDateTime recordedAt;

    protected VirtualSensorReading() { }

    public VirtualSensorReading(String sensorType, int value, boolean exceeded,
                                LocalDateTime recordedAt) {
        this.sensorType = sensorType;
        this.value = value;
        this.exceeded = exceeded;
        this.recordedAt = recordedAt;
    }

    public Long getId() { return id; }
    public String getSensorType() { return sensorType; }
    public Integer getValue() { return value; }
    public boolean isExceeded() { return exceeded; }
    public LocalDateTime getRecordedAt() { return recordedAt; }
}
