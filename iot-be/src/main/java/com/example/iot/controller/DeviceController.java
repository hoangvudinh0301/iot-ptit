package com.example.iot.controller;

import com.example.iot.dto.DeviceControlRequest;
import com.example.iot.service.MqttService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/device")
@RequiredArgsConstructor
public class DeviceController {

    private final MqttService mqttService;

    @PostMapping("/control")
    public ResponseEntity<?> controlDevice(
            @RequestBody DeviceControlRequest request) {
        String message = request.getDeviceId() + ":" + request.getStatus();
        mqttService.publish("device/control", message);
        return ResponseEntity.ok(request);
    }
}