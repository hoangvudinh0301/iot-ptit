package com.example.iot.entity;

import java.time.LocalDateTime;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Entity 
@NoArgsConstructor 
@AllArgsConstructor 
@Getter 
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SensorData {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;
    
    @ManyToOne 
    @JoinColumn(name="sensor_id", nullable = false)
    Sensor sensor;

    Double value;
    LocalDateTime createdAt;
}
