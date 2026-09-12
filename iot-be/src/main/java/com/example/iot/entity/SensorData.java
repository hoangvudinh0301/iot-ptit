package com.example.iot.entity;

import java.time.LocalDateTime;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String sensorId;
    Double temperature;
    Double humidity;
    Double light;
    LocalDateTime create_at;
}
