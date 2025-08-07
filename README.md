# Ecommerce Microservices Project

## Overview
This project is a scalable ecommerce platform built using a microservices architecture. It consists of multiple backend services and a frontend built with Next.js. Each service is independently deployable and communicates via REST APIs.

## Repository Structure
```
backend-microservices/
  api-gateway/         # Handles routing and API aggregation
  order-service/       # Manages orders and order history
  product-service/     # Handles product catalog and details
  service-registry/    # Service discovery (Eureka/Consul)
  user-service/        # Manages user accounts and authentication
  wishlist-service/    # Manages user wishlists
frontend/              # Next.js frontend for user interface
```

## Technologies Used
- **Backend:** Java, Spring Boot, Maven
- **Frontend:** Next.js, React, Tailwind CSS
- **Service Registry:** Eureka/Consul
- **API Gateway:** Spring Cloud Gateway
- **Database:** (Add your DBs here, e.g., MySQL, MongoDB)
- **Authentication:** JWT, OAuth2 (if implemented)

## Features
- User registration and authentication
- Product browsing and search
- Shopping cart and checkout
- Order management
- Wishlist functionality
- Microservices communication via REST
- API Gateway for unified access
- Service registry for dynamic discovery

## Getting Started
### Prerequisites
- Java 17+
- Node.js 18+
- Maven

### Backend Setup
1. Navigate to each microservice folder and run:
   ```powershell
   ./mvnw spring-boot:run
   ```
2. Start the service registry first, then other services.
3. Start the API Gateway last.

### Frontend Setup
1. Navigate to the `frontend` folder:
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```
2. Access the frontend at `http://localhost:3000`

## API Endpoints
- API Gateway: `/api/*`
- Product Service: `/products/*`
- Order Service: `/orders/*`
- User Service: `/users/*`
- Wishlist Service: `/wishlist/*`

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License.

## Maintainers
- [Your Name](mailto:your.email@example.com)

---
Feel free to update this README with more details as your project evolves.
