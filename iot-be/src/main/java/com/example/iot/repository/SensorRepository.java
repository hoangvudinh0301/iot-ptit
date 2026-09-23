package com.example.iot.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.iot.entity.Sensor;

public interface SensorRepository extends JpaRepository<Sensor, Integer>{

    Optional<Sensor> findByType(String type);
}