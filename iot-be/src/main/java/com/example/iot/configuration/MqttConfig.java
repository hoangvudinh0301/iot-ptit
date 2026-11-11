package com.example.iot.configuration;

import org.eclipse.paho.client.mqttv3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MqttConfig {

    @Value("${mqtt.broker-url:tcp://127.0.0.1:1884}")
    private String broker;
    @Value("${mqtt.username:admin}")
    private String username;
    @Value("${mqtt.password:}")
    private String password;

    @Bean
    public MqttClient mqttClient() throws Exception {

        MqttClient client = new MqttClient(
                broker,
                MqttClient.generateClientId()
        );

        MqttConnectOptions options = new MqttConnectOptions();
        if (username != null && !username.isBlank()) {
            options.setUserName(username);
            options.setPassword(password.toCharArray());
        }
        options.setAutomaticReconnect(true);
        options.setCleanSession(true);

        client.connect(options);

        System.out.println("MQTT connected!");

        return client;
    }
}