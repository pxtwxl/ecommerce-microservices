package com.patwal.ecommerce.wishlist_service.repo;

import com.patwal.ecommerce.wishlist_service.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepo extends JpaRepository<Wishlist, Integer> {

    List<Wishlist> findByUserId(int userId);

    Optional<Wishlist> findByUserIdAndProductId(int userId, int productId);


    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM Wishlist w WHERE w.user.id = :userId AND w.product.id = :productId")
    void deleteByUserIdAndProductId(@org.springframework.data.repository.query.Param("userId") int userId, @org.springframework.data.repository.query.Param("productId") int productId);

    boolean existsByUserIdAndProductId(int userId, int productId);
}