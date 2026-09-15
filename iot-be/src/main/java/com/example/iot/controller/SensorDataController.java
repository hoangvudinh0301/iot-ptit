package com.example.iot.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.iot.entity.SensorData;
import com.example.iot.service.SensorDataService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;


@RequiredArgsConstructor 
@RestController 
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("api/sensor-data")
public class SensorDataController {
    
    SensorDataService sensorDataService;

    @GetMapping("/all")
    public Page<SensorData> getAllSensorData(
        @RequestParam (name = "page", defaultValue = "0") int page,
        @RequestParam (name = "size", defaultValue = "10") int size
    ) {
        return sensorDataService.getAllSensorData(PageRequest.of(page, size));
    }

    @GetMapping("/chart")
    public List<SensorData> getAllSensorDataChart() {
        return sensorDataService.getAllSensorDataChart();
    }

    @GetMapping("/search/name")
    public Page<SensorData> getSensorDataBySensorName(@RequestParam String sensorName, 
        @RequestParam (name = "page", defaultValue = "0") int page,
        @RequestParam (name = "size", defaultValue = "10") int size
    ) {
        return sensorDataService.getSensorDataBySensorName(sensorName, PageRequest.of(page, size));
    }
    
    @GetMapping("/search/date")
    public Page<SensorData> getSensorDataByDate(@RequestParam LocalDate date, 
        @RequestParam (name = "page", defaultValue = "0") int page,
        @RequestParam (name = "size", defaultValue = "10") int size
    ) {
        return sensorDataService.getSensorDataByDate(date, PageRequest.of(page, size));
    }
    
}
