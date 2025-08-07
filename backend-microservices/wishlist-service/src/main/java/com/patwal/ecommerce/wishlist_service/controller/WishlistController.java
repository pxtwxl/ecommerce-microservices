package com.patwal.ecommerce.wishlist_service.controller;


import com.patwal.ecommerce.wishlist_service.model.Wishlist;
import com.patwal.ecommerce.wishlist_service.service.JwtService;
import com.patwal.ecommerce.wishlist_service.service.UserService;
import com.patwal.ecommerce.wishlist_service.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
// ...removed @CrossOrigin, rely on global CORS config...
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<Wishlist>> getUserWishlist(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String username = jwtService.extractUsername(token);
            int userId = userService.getUserId(username);
            List<Wishlist> wishlist = wishlistService.getUserWishlist(userId);
            return ResponseEntity.ok(wishlist);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{productId}")
    public ResponseEntity<String> addToWishlist(
            @PathVariable int productId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String username = jwtService.extractUsername(token);
            int userId = userService.getUserId(username);

            boolean added = wishlistService.addToWishlist(userId, productId);
            if (added) {
                return ResponseEntity.ok("Product added to wishlist");
            } else {
                return ResponseEntity.badRequest().body("Product already in wishlist or not found");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error adding to wishlist");
        }
    }

    @DeleteMapping("/{wishlistId}")
    public ResponseEntity<String> removeFromWishlist(
            @PathVariable int wishlistId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String username = jwtService.extractUsername(token);
            int userId = userService.getUserId(username);

            // Optionally, check if the wishlist entry belongs to the user
            Wishlist wishlist = wishlistService.getWishlistById(wishlistId);
            if (wishlist == null || wishlist.getUser().getId() != userId) {
                return ResponseEntity.badRequest().body("Wishlist entry not found or not owned by user");
            }

            wishlistService.deleteWishlistById(wishlistId);
            return ResponseEntity.ok("Wishlist entry removed");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error removing from wishlist");
        }
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<Boolean> isInWishlist(
            @PathVariable int productId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String username = jwtService.extractUsername(token);
            int userId = userService.getUserId(username);

            boolean isInWishlist = wishlistService.isInWishlist(userId, productId);
            return ResponseEntity.ok(isInWishlist);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}