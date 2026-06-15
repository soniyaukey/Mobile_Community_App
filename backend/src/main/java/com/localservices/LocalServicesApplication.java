package com.localservices;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.localservices", "com.localservices.config", "com.localservices.security"})
public class LocalServicesApplication {
    public static void main(String[] args) {
        SpringApplication.run(LocalServicesApplication.class, args);
    }
}
