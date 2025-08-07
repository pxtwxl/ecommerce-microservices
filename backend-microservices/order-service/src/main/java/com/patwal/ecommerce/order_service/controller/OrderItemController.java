package com.patwal.ecommerce.order_service.controller;

import com.patwal.ecommerce.order_service.service.OrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
// ...removed @CrossOrigin, rely on global CORS config...
@RequestMapping("/orderitems")
public class OrderItemController {

    @Autowired
    private OrderItemService service;


}
