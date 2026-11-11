
package com.example.iot;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class PasswordGenerator {

    @Bean
    CommandLineRunner generatePassword(PasswordEncoder encoder) {
        return args -> {
            String password = "123456";

            String hash = encoder.encode(password);

            System.out.println("==========================");
            System.out.println("BCrypt Hash: " + hash);
            System.out.println("Matches: " + encoder.matches(password, hash));
            System.out.println("==========================");
        };
    }
}
