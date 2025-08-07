package com.patwal.ecommerce.product_service.service;

import com.patwal.ecommerce.product_service.model.Product;
import com.patwal.ecommerce.product_service.model.User;
import com.patwal.ecommerce.product_service.repo.ProductRepo;
import com.patwal.ecommerce.product_service.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepo repo;
    @Autowired
    private UserRepo userRepo;


    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    public Product getProductById(int id){
        return repo.findById(id).orElse(null);
    }

    public Product addProduct(Product product, MultipartFile imageFile, Integer sellerId) throws IOException {
        if (sellerId != null) {
            product.setSellerId(Long.valueOf(sellerId));  // just set the ID, not the object
        }

        product.setImageName(imageFile.getOriginalFilename());
        product.setImageType(imageFile.getContentType());
        product.setImageData(Base64.getEncoder().encodeToString(imageFile.getBytes()));

        return repo.save(product);
    }

    public Product updateProduct(int id, Product product, MultipartFile imageFile) throws IOException {
        product.setImageData(Base64.getEncoder().encodeToString(imageFile.getBytes()));
        product.setImageName(imageFile.getOriginalFilename());
        product.setImageType(imageFile.getContentType());
        return repo.save(product);
    }

    public void deleteProduct(int id) {
        repo.deleteById(id);
    }

    public List<Product> searchProducts(String keyword) {
        return repo.searchProducts(keyword);
    }

    private String loadImageAsBase64(String imageName) {
        try (InputStream is = getClass().getResourceAsStream("/static" + imageName)) {
            if (is != null) {
                byte[] imageBytes = is.readAllBytes();
                return Base64.getEncoder().encodeToString(imageBytes);
            }
        } catch (Exception e) {
            // Optionally log error
        }
        return null;
    }

    public void load() {
        Product p1 = new Product();
        p1.setName("iPhone 15 Pro");
        p1.setDescription("Latest Apple flagship phone");
        p1.setBrand("Apple");
        p1.setPrice(new BigDecimal("1199.99"));
        p1.setCategory("Smartphones");
        p1.setReleaseDate(java.sql.Date.valueOf("2025-01-01"));
        p1.setProductAvailable(true);
        p1.setStockQuantity(50);
        p1.setImageName("/iphone15.jpg");
        p1.setImageType("image/jpeg");
        p1.setImageData(loadImageAsBase64("/iphone15.jpg"));

        Product p2 = new Product();
        p2.setName("Samsung Galaxy S24");
        p2.setDescription("Newest Samsung Galaxy series");
        p2.setBrand("Samsung");
        p2.setPrice(new BigDecimal("1099.99"));
        p2.setCategory("Smartphones");
        p2.setReleaseDate(java.sql.Date.valueOf("2025-02-10"));
        p2.setProductAvailable(true);
        p2.setStockQuantity(40);
        p2.setImageName("/s24.jpg");
        p2.setImageType("image/jpeg");
        p2.setImageData(loadImageAsBase64("/s24.jpg"));

        Product p3 = new Product();
        p3.setName("Sony WH-1000XM5");
        p3.setDescription("Noise Cancelling Headphones");
        p3.setBrand("Sony");
        p3.setPrice(new BigDecimal("399.99"));
        p3.setCategory("Headphones");
        p3.setReleaseDate(java.sql.Date.valueOf("2024-06-15"));
        p3.setProductAvailable(true);
        p3.setStockQuantity(100);
        p3.setImageName("/wh1000.jpg");
        p3.setImageType("image/jpeg");
        p3.setImageData(loadImageAsBase64("/wh1000.jpg"));

        Product p4 = new Product();
        p4.setName("Dell XPS 13");
        p4.setDescription("13-inch Ultrabook Laptop");
        p4.setBrand("Dell");
        p4.setPrice(new BigDecimal("1499.99"));
        p4.setCategory("Laptops");
        p4.setReleaseDate(java.sql.Date.valueOf("2023-11-20"));
        p4.setProductAvailable(true);
        p4.setStockQuantity(25);
        p4.setImageName("/xps13.jpg");
        p4.setImageType("image/jpeg");
        p4.setImageData(loadImageAsBase64("/xps13.jpg"));

        Product p5 = new Product();
        p5.setName("Apple Watch Series 9");
        p5.setDescription("Smartwatch with health features");
        p5.setBrand("Apple");
        p5.setPrice(new BigDecimal("499.99"));
        p5.setCategory("Wearables");
        p5.setReleaseDate(java.sql.Date.valueOf("2025-03-05"));
        p5.setProductAvailable(true);
        p5.setStockQuantity(75);
        p5.setImageName("/watch9.jpg");
        p5.setImageType("image/jpeg");
        p5.setImageData(loadImageAsBase64("/watch9.jpg"));

        List<Product> products = new ArrayList<>(Arrays.asList(p1, p2, p3, p4, p5));
        repo.saveAll(products);
    }

    public void deleteAll() {
        repo.deleteAll();
    }

    public List<Product> findSellerProducts(int sellerid) {
        return repo.findBySellerId(sellerid);
    }

    public List<Product> getProductsByCategory(String category) {
        return repo.findByCategory(category);
    }
}
