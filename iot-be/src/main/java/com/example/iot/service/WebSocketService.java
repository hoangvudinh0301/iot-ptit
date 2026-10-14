package com.example.iot.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendSensorData(Object data) {
        messagingTemplate.convertAndSend(
            "/topic/sensors",
            data
        );
    }

    public void sendDeviceStatus(Object data) {
        messagingTemplate.convertAndSend(
            "/topic/devices",
            data
        );
    }
}