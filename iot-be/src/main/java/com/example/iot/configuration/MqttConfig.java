package com.example.iot.configuration;

import org.eclipse.paho.client.mqttv3.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MqttConfig {

    private final String broker = "tcp://172.20.10.3:1884";
    private final String username = "admin";
    private final String password = "123456";

    @Bean
    public MqttClient mqttClient() throws Exception {

        MqttClient client = new MqttClient(
                broker,
                MqttClient.generateClientId()
        );

        MqttConnectOptions options = new MqttConnectOptions();
        options.setUserName(username);
        options.setPassword(password.toCharArray());
        options.setAutomaticReconnect(true);
        options.setCleanSession(true);

        client.connect(options);

        System.out.println("MQTT connected!");

        return client;
    }
}