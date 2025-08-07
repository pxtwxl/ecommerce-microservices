package com.patwal.ecommerce.order_service.repo;

import com.patwal.ecommerce.order_service.model.orders.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepo extends JpaRepository<OrderItem,Integer> {
}
