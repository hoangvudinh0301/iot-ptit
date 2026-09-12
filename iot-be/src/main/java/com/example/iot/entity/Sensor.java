package com.example.iot.entity;

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
@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor 
@FieldDefaults(level = AccessLevel.PRIVATE)

public class Sensor {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)

    String id;
    String name;
    String type;
    String location;
}
