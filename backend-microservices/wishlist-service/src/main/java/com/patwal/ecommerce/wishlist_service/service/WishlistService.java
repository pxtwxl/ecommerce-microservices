package com.patwal.ecommerce.wishlist_service.service;


import com.patwal.ecommerce.wishlist_service.model.Product;
import com.patwal.ecommerce.wishlist_service.model.User;
import com.patwal.ecommerce.wishlist_service.model.Wishlist;
import com.patwal.ecommerce.wishlist_service.repo.ProductRepo;
import com.patwal.ecommerce.wishlist_service.repo.UserRepo;
import com.patwal.ecommerce.wishlist_service.repo.WishlistRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepo wishlistRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ProductRepo productRepo;

    public List<Wishlist> getUserWishlist(int userId) {
        return wishlistRepo.findByUserId(userId);
    }

    public boolean addToWishlist(int userId, int productId) {
        Optional<User> user = userRepo.findById(userId);
        Optional<Product> product = productRepo.findById(productId);

        if (user.isPresent() && product.isPresent()) {
            // Check if already in wishlist
            if (!wishlistRepo.existsByUserIdAndProductId(userId, productId)) {
                Wishlist wishlistItem = new Wishlist();
                wishlistItem.setUser(user.get());
                wishlistItem.setProduct(product.get());
                wishlistRepo.save(wishlistItem);
                return true;
            }
        }
        return false;
    }

    public boolean removeFromWishlist(int userId, int productId) {
        if (wishlistRepo.existsByUserIdAndProductId(userId, productId)) {
            wishlistRepo.deleteByUserIdAndProductId(userId, productId);
            return true;
        }
        return false;
    }

    public boolean isInWishlist(int userId, int productId) {
        return wishlistRepo.existsByUserIdAndProductId(userId, productId);
    }

    public Wishlist getWishlistById(int wishlistId) {
        return wishlistRepo.findById(wishlistId).orElse(null);
    }

    public void deleteWishlistById(int wishlistId) {
        wishlistRepo.deleteById(wishlistId);
    }
}