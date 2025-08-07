package com.patwal.ecommerce.wishlist_service.repo;

import com.patwal.ecommerce.wishlist_service.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User,Integer> {
    User findByUsername(String username);
}
