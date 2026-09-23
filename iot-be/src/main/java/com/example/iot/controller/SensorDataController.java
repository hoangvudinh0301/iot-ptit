package com.example.iot.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
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
        @RequestParam (name = "size", defaultValue = "10") int size,
        @RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
        @RequestParam(name = "direction", defaultValue = "desc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("asc")
            ? Sort.by(sortBy).ascending()
            : Sort.by(sortBy).descending();
        return sensorDataService.getAllSensorData(PageRequest.of(page, size, sort));
    }

    @GetMapping("/chart")
    public List<SensorData> getAllSensorDataChart() {
        return sensorDataService.getAllSensorDataChart();
    }

    @GetMapping("/search/name")
    public Page<SensorData> getSensorDataBySensorName(@RequestParam String sensorName, 
        @RequestParam (name = "page", defaultValue = "0") int page,
        @RequestParam (name = "size", defaultValue = "10") int size,
        @RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
        @RequestParam(name = "direction", defaultValue = "desc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("asc")
            ? Sort.by(sortBy).ascending()
            : Sort.by(sortBy).descending();
        return sensorDataService.getSensorDataBySensorName(sensorName, PageRequest.of(page, size, sort));
    }
    
    @GetMapping("/search/date")
    public Page<SensorData> getSensorDataByDate(@RequestParam String date, 
        @RequestParam (name = "page", defaultValue = "0") int page,
        @RequestParam (name = "size", defaultValue = "10") int size,
        @RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
        @RequestParam(name = "direction", defaultValue = "desc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("asc")
            ? Sort.by(sortBy).ascending()
            : Sort.by(sortBy).descending();

        return sensorDataService.getSensorDataByDate(date, PageRequest.of(page, size, sort));
    }
    @GetMapping("/latest")
    public ResponseEntity<?> getLatest() {

        Map<String, Object> result = new HashMap<>();
        result.put(
            "temperature",
            sensorDataService.getLatestByType("temperature")
                .map(SensorData::getValue)
                .orElse(null)
        );
        result.put(
            "humidity",
            sensorDataService.getLatestByType("humidity")
                .map(SensorData::getValue)
                .orElse(null)
        );
        result.put(
            "light",
            sensorDataService.getLatestByType("light")
                .map(SensorData::getValue)
                .orElse(null)
        );
        return ResponseEntity.ok(result);
    }
}
