package com.example.iot.service;

import com.example.iot.entity.VirtualSensorReading;
import com.example.iot.repository.VirtualSensorReadingRepository;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import tools.jackson.databind.JsonNode;

@Service
public class VirtualSensorService {
    // Keep in sync with the ESP32 firmware. 50% of each sensor's MAX.
    private static final String[] KEYS = {"virtual1", "virtual2", "virtual3"};
    private static final int[] MINIMUMS = {1, 101, 201};
    private static final int[] MAXIMUMS = {100, 200, 300};
    private static final int[] THRESHOLDS = {50, 150, 250};
    private static final int[] GPIO_PINS = {17, 4, 2};
    private final VirtualSensorReadingRepository repository;

    public VirtualSensorService(VirtualSensorReadingRepository repository) {
        this.repository = repository;
    }

    // An exceedance = one received sensor sample whose value > threshold.
    // This runs once for each received sensor/data MQTT message.
    public void recordFromMqtt(JsonNode payload) {
        LocalDateTime timestamp = LocalDateTime.now();
        for (int i = 0; i < KEYS.length; i++) {
            JsonNode node = payload.get(KEYS[i]);
            if (node == null || !node.isIntegralNumber()) continue;
            int value = node.asInt();
            if (value < MINIMUMS[i] || value > MAXIMUMS[i]) continue;
            repository.save(new VirtualSensorReading(
                KEYS[i], value, value > THRESHOLDS[i], timestamp));
        }
    }

    public Map<String, Object> getStatistics(LocalDate day) {
        LocalDateTime start = day.atStartOfDay();
        LocalDateTime end = day.plusDays(1).atStartOfDay();
        LocalDateTime now = LocalDateTime.now();
        List<Map<String, Object>> sensors = new ArrayList<>();
        long totalExceedances = 0;

        for (int i = 0; i < KEYS.length; i++) {
            String key = KEYS[i];
            long sampleCount = repository.countBySensorTypeAndRecordedAtGreaterThanEqualAndRecordedAtLessThan(
                key, start, end);
            long count = repository.countBySensorTypeAndExceededTrueAndRecordedAtGreaterThanEqualAndRecordedAtLessThan(
                key, start, end);
            VirtualSensorReading latest = repository.findTopBySensorTypeOrderByRecordedAtDesc(key).orElse(null);
            boolean online = latest != null &&
                !latest.getRecordedAt().isAfter(now) &&
                Duration.between(latest.getRecordedAt(), now).getSeconds() <= 12;

            Map<String, Object> item = new LinkedHashMap<>();
            item.put("key", key);
            item.put("name", "Cảm biến " + (i + 4));
            item.put("sensorNumber", i + 4);
            item.put("gpio", GPIO_PINS[i]);
            item.put("min", MINIMUMS[i]);
            item.put("max", MAXIMUMS[i]);
            item.put("threshold", THRESHOLDS[i]);
            item.put("count", count);
            item.put("samples", sampleCount);
            item.put("value", latest == null ? null : latest.getValue());
            item.put("lastUpdated", latest == null ? null : latest.getRecordedAt());
            item.put("online", online);
            item.put("aboveThreshold", online && latest.isExceeded());
            sensors.add(item);
            totalExceedances += count;
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("date", day.toString());
        response.put("totalExceedances", totalExceedances);
        response.put("sensors", sensors);
        return response;
    }
}
