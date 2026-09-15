package com.example.iot.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.iot.entity.SensorData;
import com.example.iot.repository.SensorDataRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service 
@RequiredArgsConstructor 
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SensorDataService {

    SensorDataRepository sensorDataRepository;

    public List<SensorData> getAllSensorDataChart() {
        return sensorDataRepository.findAll();
    }

    public Page<SensorData> getAllSensorData(Pageable pageable) {
        return sensorDataRepository.findAll(pageable);
    }

    public Page<SensorData> getSensorDataBySensorName(String sensorName, Pageable pageable) {
        return sensorDataRepository.searchSensorDataBySensorName(sensorName, pageable);
    }

    public Page<SensorData> getSensorDataByDate(LocalDate date, Pageable pageable) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.atTime(LocalTime.MAX);
        return sensorDataRepository.findByCreatedAtBetween(start, end, pageable);
    }
}
