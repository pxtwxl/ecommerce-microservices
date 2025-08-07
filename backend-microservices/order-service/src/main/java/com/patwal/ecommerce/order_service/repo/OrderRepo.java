package com.patwal.ecommerce.order_service.repo;

import com.patwal.ecommerce.order_service.model.orders.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepo extends JpaRepository<Order,Integer> {

    List<Order> findByBuyerId(int userId);
}
