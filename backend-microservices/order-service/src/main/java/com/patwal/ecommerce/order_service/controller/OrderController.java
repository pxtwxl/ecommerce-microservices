package com.patwal.ecommerce.order_service.controller;


import com.patwal.ecommerce.order_service.dto.OrderCreateRequest;
import com.patwal.ecommerce.order_service.dto.OrderResponseDTO;
import com.patwal.ecommerce.order_service.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
// ...removed @CrossOrigin, rely on global CORS config...
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService service;

    @GetMapping("buyer/{userId}")
    public List<OrderResponseDTO> getOrdersForBuyer(@PathVariable("userId") int userId) {
        return service.fetchOrders(userId);
    }

    @PostMapping("checkout")
    public void createOrder(@RequestBody OrderCreateRequest request) {
        service.createOrder(request);
    }
}
