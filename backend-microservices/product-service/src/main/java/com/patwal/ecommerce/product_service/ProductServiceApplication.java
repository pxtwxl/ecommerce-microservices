package com.patwal.ecommerce.product_service;

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
public class ProductServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProductServiceApplication.class, args);
	}

}
