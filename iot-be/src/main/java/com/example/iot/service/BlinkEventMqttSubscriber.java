
package com.example.iot.service;

import com.example.iot.entity.BlinkEvent;
import com.example.iot.repository.BlinkEventRepository;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import jakarta.annotation.PreDestroy;
import org.eclipse.paho.client.mqttv3.*;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Component
public class BlinkEventMqttSubscriber implements ApplicationRunner {

    private final BlinkEventRepository repository;
    private final ObjectMapper objectMapper;

    @Value("${mqtt.broker-url:tcp://127.0.0.1:1884}")
    private String brokerUrl;

    @Value("${mqtt.username:admin}")
    private String username;

    @Value("${mqtt.password:123456}")
    private String password;

    private MqttClient mqttClient;

    public BlinkEventMqttSubscriber(
            BlinkEventRepository repository,
            ObjectMapper objectMapper
    ) {
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        String clientId =
                "iot-blink-stats-" + UUID.randomUUID();

        mqttClient = new MqttClient(
                brokerUrl,
                clientId,
                new MemoryPersistence()
        );

        MqttConnectOptions options = new MqttConnectOptions();
        options.setAutomaticReconnect(true);
        options.setCleanSession(true);

        if (username != null && !username.isBlank()) {
            options.setUserName(username);
            options.setPassword(password.toCharArray());
        }

        mqttClient.setCallback(new MqttCallbackExtended() {
            @Override
            public void connectComplete(
                    boolean reconnect,
                    String serverURI
            ) {
                try {
                    mqttClient.subscribe("device/blink-event", 1);
                    System.out.println(
                            "Subscribed: device/blink-event"
                    );
                } catch (MqttException e) {
                    System.err.println(
                            "Cannot subscribe blink event: "
                                    + e.getMessage()
                    );
                }
            }

            @Override
            public void connectionLost(Throwable cause) {
                System.err.println(
                        "Blink MQTT connection lost: "
                                + (cause == null
                                   ? "unknown"
                                   : cause.getMessage())
                );
            }

            @Override
            public void messageArrived(
                    String topic,
                    MqttMessage message
            ) throws Exception {
                JsonNode json =
                        objectMapper.readTree(message.getPayload());

                if (!json.hasNonNull("deviceId")
                        || !json.hasNonNull("sensorType")) {
                    return;
                }

                int deviceId = json.get("deviceId").asInt();
                String sensorType =
                        json.get("sensorType").asText();

                if (deviceId < 1 || deviceId > 3) {
                    return;
                }

                if (!Set.of(
                        "temperature",
                        "humidity",
                        "light"
                ).contains(sensorType)) {
                    return;
                }

                BlinkEvent event = new BlinkEvent(deviceId, sensorType);
                event.setDeviceId(deviceId);
                event.setSensorType(sensorType);
                event.setOccurredAt(LocalDateTime.now());

                repository.save(event);
            }

            @Override
            public void deliveryComplete(
                    IMqttDeliveryToken token
            ) {
            }
        });

        mqttClient.connect(options);
    }

    @PreDestroy
    public void shutdown() {
        try {
            if (mqttClient != null && mqttClient.isConnected()) {
                mqttClient.disconnect();
            }

            if (mqttClient != null) {
                mqttClient.close();
            }
        } catch (MqttException e) {
            System.err.println(
                    "Cannot close blink MQTT client: "
                            + e.getMessage()
            );
        }
    }
}
