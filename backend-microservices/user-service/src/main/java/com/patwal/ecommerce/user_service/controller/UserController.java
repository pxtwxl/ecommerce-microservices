package com.patwal.ecommerce.user_service.controller;


import com.patwal.ecommerce.user_service.model.User;
import com.patwal.ecommerce.user_service.service.JwtService;
import com.patwal.ecommerce.user_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
// ...removed @CrossOrigin, rely on global CORS config...
@RequestMapping("/user")
@Transactional
public class UserController {

    @Autowired
    private UserService service;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @PostMapping("register")
    public User register(@RequestBody User user) {
        return service.saveUser(user);
    }

    @PostMapping("login")
    public String login(@RequestBody User user) throws Exception {

        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(),user.getPassword()));

        if(authentication.isAuthenticated())
            return jwtService.generateToken(user.getUsername());
        else
            return "Login Failed";
    }

        @GetMapping("/profile")
    public int getCurrentUserId(@RequestHeader("Authorization") String authHeader) {
        // Expect header: Bearer <token>
        String token = authHeader.replace("Bearer ", "");
        String username = jwtService.extractUsername(token);
        return service.getUserId(username);
    }

    @GetMapping("/profile/{id}")
    public User getUser(@PathVariable("id") int id) {
        return service.fetchUser(id);
    }

    @PutMapping("/profile/{id}")
    public User updateProfile(@PathVariable("id") int id,@RequestBody User user) {
        return service.updateUser(id,user);
    }

    @PutMapping("profile/{id}/image")
    public void updateProfileImage(@PathVariable("id") int id,@RequestPart User user,@RequestPart MultipartFile imageFile) {
        service.updateUserProfileImage(id,imageFile);
    }

    @GetMapping("/profile/username/{username}")
    public int getUserId(@PathVariable("username") String username) {
        return service.getUserId(username);
    }

}
