package com.patwal.ecommerce.wishlist_service.repo;

import com.patwal.ecommerce.wishlist_service.model.orders.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepo extends JpaRepository<OrderItem,Integer> {
}
