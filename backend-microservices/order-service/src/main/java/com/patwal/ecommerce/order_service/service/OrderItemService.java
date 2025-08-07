package com.patwal.ecommerce.order_service.service;

import com.patwal.ecommerce.order_service.repo.OrderItemRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderItemService {

    @Autowired
    private OrderItemRepo repo;
}
