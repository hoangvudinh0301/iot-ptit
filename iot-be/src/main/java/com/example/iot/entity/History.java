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
@Getter 
@Setter
@NoArgsConstructor 
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class History {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;
    
    @ManyToOne
    @JoinColumn(name = "device_id", nullable = false)
    Device device;

    Integer userId;
    String action;
    String status;
    LocalDateTime createdAt;
}
