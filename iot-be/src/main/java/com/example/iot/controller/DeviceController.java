package com.example.iot.controller;

import com.example.iot.dto.DeviceControlRequest;
import com.example.iot.entity.Device;
import com.example.iot.entity.History;
import com.example.iot.repository.DeviceRepository;
import com.example.iot.repository.HistoryRepository;
import com.example.iot.service.DeviceService;
import com.example.iot.service.MqttService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/device")
@RequiredArgsConstructor
@FieldDefaults (level = AccessLevel.PRIVATE, makeFinal = true)
public class DeviceController {

    private final DeviceService deviceService;
    HistoryRepository historyRepository;
    MqttService mqttService;
    DeviceRepository deviceRepository;

    @PostMapping("/control")
    public ResponseEntity<?> controlDevice(
            @RequestBody DeviceControlRequest request) {
        String message = request.getDeviceId() + ":" + request.getAction();
        boolean mqttSent = mqttService.publish("device/control", message);
        System.out.println("MQTT sent: " + mqttSent);
        Device device = deviceRepository.findById(request.getDeviceId())
                    .orElseThrow(() -> new RuntimeException("Device not found"));
        History history = new History();
        history.setUserId(request.getUserId());
        history.setDevice(device);
        history.setAction(request.getAction());
        history.setStatus("PENDING");
        historyRepository.save(history);
        return ResponseEntity.ok(history);
    }
    @GetMapping
    public ResponseEntity<Device> getDeviceStatus(@RequestParam Integer deviceId) {
        Device device = deviceService.getDeviceById(deviceId);
        return ResponseEntity.ok(device);
    }
}