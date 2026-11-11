package com.example.iot.service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.LinkedHashMap;

import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallbackExtended;
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
    VirtualSensorService virtualSensorService;
    ObjectMapper objectMapper;

    @PostConstruct
    public void init() {
        System.out.println("Initializing MQTT...");
        // With clean sessions, broker subscriptions must be restored after reconnect.
        mqttClient.setCallback(new MqttCallbackExtended() {
            @Override
            public void connectComplete(boolean reconnect, String serverURI) {
                if (reconnect) subscribe();
            }

            @Override
            public void connectionLost(Throwable cause) {
                System.err.println("MQTT connection lost: " +
                    (cause == null ? "unknown" : cause.getMessage()));
            }

            @Override
            public void messageArrived(String topic, MqttMessage message) { }

            @Override
            public void deliveryComplete(IMqttDeliveryToken token) { }
        });
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
            String payload = new String(mqttMessage.getPayload(), java.nio.charset.StandardCharsets.UTF_8);
            JsonNode json = objectMapper.readTree(payload);

            // Three new simulated sensors are persisted independently of DHT11.
            virtualSensorService.recordFromMqtt(json);

            Map<String, Object> socketPayload = new LinkedHashMap<>();
            for (String type : new String[]{"temperature", "humidity", "light"}) {
                JsonNode value = json.get(type);
                if (value != null && value.isNumber()) {
                    double number = value.asDouble();
                    try {
                        sensorDataService.saveSensorData(type, number);
                        socketPayload.put(type, number);
                    } catch (Exception ex) {
                        System.err.println("Cannot store " + type + ": " + ex.getMessage());
                    }
                }
            }
            for (String type : new String[]{"virtual1", "virtual2", "virtual3"}) {
                JsonNode value = json.get(type);
                if (value != null && value.isIntegralNumber()) {
                    socketPayload.put(type, value.asInt());
                }
            }
            socketPayload.put("createdAt", LocalDateTime.now().toString());
            webSocketService.sendSensorData(socketPayload);
        } catch (Exception e) {
            System.err.println("Error processing sensor data: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void handleStatus(String topic, MqttMessage mqttMessage) {
        String status = new String(
            mqttMessage.getPayload(),
            java.nio.charset.StandardCharsets.UTF_8
        ).trim().toUpperCase();

        System.out.println("Received MQTT status: " + topic + " -> " + status);

        try {
            String[] parts = topic.split("/");
            Integer deviceId = Integer.parseInt(parts[2]);

            if (!status.equals("ON") && !status.equals("OFF")) {
                System.out.println("Invalid device status: " + status);
                return;
            }

            Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() ->
                    new RuntimeException("Device not found: " + deviceId)
                );

            var pendingHistory =
                historyRepository.findFirstByDevice_IdAndStatusOrderByCreatedAtDesc(
                    deviceId,
                    "PENDING"
                );

            if (pendingHistory.isPresent()) {
                var history = pendingHistory.get();
                if (status.equalsIgnoreCase(history.getAction())) {
                    history.setStatus("SUCCESS");
                    historyRepository.save(history);

                    System.out.println(
                        "History SUCCESS: Device " + deviceId
                        + " -> " + status
                    );
                }
            }
            device.setStatus(status);
            deviceRepository.save(device);
            webSocketService.sendDeviceStatus(Map.of(
                "deviceId", deviceId,
                "status", status
            ));

        } catch (Exception e) {
            System.out.println("Error processing device status");
            e.printStackTrace();
        }
    }

}
