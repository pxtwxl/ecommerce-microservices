package com.patwal.ecommerce.order_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication(
		exclude = {
				org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class,
				org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration.class
		}
)
@EnableFeignClients
public class OrderServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(OrderServiceApplication.class, args);
	}

}
