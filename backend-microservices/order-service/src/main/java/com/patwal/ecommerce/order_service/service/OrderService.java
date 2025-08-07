package com.patwal.ecommerce.order_service.service;


import com.patwal.ecommerce.order_service.dto.OrderCreateRequest;
import com.patwal.ecommerce.order_service.dto.OrderItemDTO;
import com.patwal.ecommerce.order_service.dto.OrderResponseDTO;
import com.patwal.ecommerce.order_service.model.Product;
import com.patwal.ecommerce.order_service.model.User;
import com.patwal.ecommerce.order_service.model.orders.Order;
import com.patwal.ecommerce.order_service.model.orders.OrderItem;
import com.patwal.ecommerce.order_service.repo.OrderItemRepo;
import com.patwal.ecommerce.order_service.repo.OrderRepo;
import com.patwal.ecommerce.order_service.repo.ProductRepo;
import com.patwal.ecommerce.order_service.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private OrderItemRepo orderItemRepo;

    @Autowired
    private UserRepo userRepo;
    @Autowired
    private ProductRepo productRepo;


    public List<OrderResponseDTO> fetchOrders(int userId) {
        List<Order> orders = orderRepo.findByBuyerId(userId);
        List<OrderResponseDTO> dtos = (List<OrderResponseDTO>) orders.stream().map(order -> {
            OrderResponseDTO dto = new OrderResponseDTO();
            dto.setId(order.getOrderId());
            dto.setOrderDate(order.getOrderDate());
            dto.setStatus(order.getOrderStatus());
            dto.setTotalAmount(order.getOrderPrice());
            // Map order items
            List<OrderItemDTO> itemDTOs = (List<OrderItemDTO>) order.getItems().stream().map(item -> {
                OrderItemDTO itemDTO = new OrderItemDTO();
                itemDTO.setId(item.getOrderItemId());
                itemDTO.setProductId(item.getProduct().getId());
                itemDTO.setProductName(item.getProduct().getName());
                itemDTO.setQuantity(item.getQuantity());
                itemDTO.setPrice(item.getPrice());
                return itemDTO;
            }).collect(Collectors.toList());
            dto.setItems(itemDTOs);
            return dto;
        }).collect(Collectors.toList());

        return dtos;
    }

    public void createOrder(OrderCreateRequest request) {
        User buyer = userRepo.findById(request.getBuyerId())
            .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setBuyer(buyer);
        order.setOrderDate(new Date());
        order.setOrderStatus("PENDING");
        order.setOrderPrice(0);
        order.setItems(new ArrayList<>()); // initialize empty list

        order = orderRepo.save(order); // Save to get orderId

        long total = 0;
        for (OrderCreateRequest.OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepo.findById(itemReq.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order); // set parent order
            orderItem.setProduct(product);
            orderItem.setQuantity(itemReq.getQuantity());
            orderItem.setPrice(itemReq.getPrice());
            order.getItems().add(orderItem); // add to order's list

            total += itemReq.getPrice() * itemReq.getQuantity();
        }
        order.setOrderPrice(total);

        orderRepo.save(order); // Cascade saves items
    }
}