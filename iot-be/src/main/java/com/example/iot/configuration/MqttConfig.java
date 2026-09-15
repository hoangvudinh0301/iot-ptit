package com.example.iot.configuration;


import org.springframework.context.annotation.Configuration;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.springframework.context.annotation.Bean;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@Configuration 
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MqttConfig {

    String broker = "tcp://172.20.10.3:1883";
    String username = "admin";
    String password = "123456";

    @Bean
    public MqttClient mqttClient() throws Exception {

        MqttClient client = new MqttClient(broker, MqttClient.generateClientId());
        MqttConnectOptions options = new MqttConnectOptions();
        options.setUserName(username);
        options.setPassword(password.toCharArray());
        options.setAutomaticReconnect(true);
        options.setCleanSession(true);
        client.connect(options);
        return client;
    }
}
