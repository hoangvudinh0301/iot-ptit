
package com.example.iot.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "blink_events")
public class BlinkEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "device_id", nullable = false)
    private Integer deviceId;

    @Column(name = "sensor_type", nullable = false, length = 32)
    private String sensorType;

    @Column(name = "occurred_at", nullable = false)
    private LocalDateTime occurredAt;

    // Constructor không tham số cho Hibernate
    protected BlinkEvent() {
    }

    // Constructor dùng khi nhận sự kiện từ MQTT
    public BlinkEvent(int deviceId, String sensorType) {
        this.deviceId = deviceId;
        this.sensorType = sensorType;
    }

    // Tự động thiết lập thời gian trước khi lưu vào database
    @PrePersist
    public void prePersist() {
        if (occurredAt == null) {
            occurredAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public Integer getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(Integer deviceId) {
        this.deviceId = deviceId;
    }

    public String getSensorType() {
        return sensorType;
    }

    public void setSensorType(String sensorType) {
        this.sensorType = sensorType;
    }

    public LocalDateTime getOccurredAt() {
        return occurredAt;
    }

    public void setOccurredAt(LocalDateTime occurredAt) {
        this.occurredAt = occurredAt;
    }
}
