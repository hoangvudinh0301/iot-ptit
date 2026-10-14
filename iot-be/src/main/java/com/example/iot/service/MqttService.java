package com.example.iot.service;

import java.time.LocalDateTime;
import java.util.Map;

import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.springframework.stereotype.Service;

import com.example.iot.entity.Device;
import com.example.iot.repository.DeviceRepository;
import com.example.iot.repository.HistoryRepository;

import jakarta.annotation.PostConstruct;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Service 
@RequiredArgsConstructor 
@FieldDefaults (level = AccessLevel.PRIVATE, makeFinal = true)
public class MqttService {

    MqttClient mqttClient;
    DeviceRepository deviceRepository;
    HistoryRepository historyRepository;
    WebSocketService webSocketService;
    SensorDataService sensorDataService;
    ObjectMapper objectMapper;

    @PostConstruct
    public void init() {
        System.out.println("Initializing MQTT...");
        subscribe();
    }

    public boolean publish(String topic, String message) {
        
        if (mqttClient == null) {
            System.out.println("MQTT not connected!");
            return false;
        }
        try {
            MqttMessage mqttMessage = new MqttMessage(message.getBytes());
            mqttMessage.setQos(1);
            mqttClient.publish(topic, mqttMessage);
        } catch (Exception e) {
            System.out.println("MQTT unvailable: " + e.getMessage());
            return false;
        }
        return true;
    }

    public void subscribe() {

        try {
            mqttClient.subscribe("sensor/data", this::handleSensorData);
            System.out.println("Subscribed: sensor/data");
            mqttClient.subscribe("device/status/+", this::handleStatus);
            System.out.println("Subscribed: device/status/+");
        } catch (MqttException e) {
            e.printStackTrace();
        }
    }
    
    public void handleSensorData(String topic, MqttMessage mqttMessage) {
        try {
            String payload = new String(mqttMessage.getPayload());
            System.out.println("Received sensor data: " + payload);
            JsonNode json = objectMapper.readTree(payload);
            double temperature =json.get("temperature").asDouble();
            double humidity =json.get("humidity").asDouble();
            double light =json.get("light").asDouble();
            sensorDataService.saveSensorData("temperature", temperature);
            sensorDataService.saveSensorData("humidity", humidity);
            sensorDataService.saveSensorData("light", light);
            System.out.println("Sensor data saved successfully");
            webSocketService.sendSensorData(Map.of(
                "temperature", temperature,
                "humidity", humidity,
                "light", light,
                "createdAt", LocalDateTime.now().toString()
            ));
        } catch (Exception e) {
            System.out.println("Error processing sensor data");
            e.printStackTrace();
        }
    }

    public void handleStatus(String topic, MqttMessage mqttMessage) {
        String status = new String(mqttMessage.getPayload()).trim().toUpperCase();
        System.out.println("Received MQTT status: " + topic + " -> " + status);
        try {
            String[] parts = topic.split("/");
            Integer deviceId = Integer.parseInt(parts[2]);
            Device device = deviceRepository.findById(deviceId)
                                .orElseThrow(() -> new RuntimeException("Device not found"));
            
            device.setStatus(status);
            deviceRepository.save(device);

            historyRepository.findFirstByDevice_IdAndStatusOrderByCreatedAtDesc(
                    deviceId,
                    "PENDING"
            )
                .ifPresent(history -> {
                    history.setStatus(status);
                    device.setStatus(status);
                    historyRepository.save(history);
                    deviceRepository.save(device);
                    System.out.println("History updated: Device " + deviceId + " -> " + status);
                    webSocketService.sendDeviceStatus(Map.of(
                        "deviceId", deviceId,
                        "stauts", status
                    ));
                });

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
