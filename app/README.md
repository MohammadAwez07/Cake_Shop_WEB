# 🍰 AMMAS Pastries - Premium Cake Shop E-commerce

A complete, production-ready full-stack e-commerce application for a premium cake shop built with React, Spring Boot, and MySQL.

![AMMAS Pastries](https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200)

## ✨ Features

### Frontend
- 🎨 **Luxury Design** - Imperial Topaz theme with gold gradients and elegant aesthetics
- 📱 **Responsive** - Mobile-first design that works on all devices
- 🎬 **Animations** - Smooth Framer Motion animations throughout
- 🛒 **Shopping Cart** - Persistent cart with localStorage
- 🔍 **Product Filtering** - Search, category filter, sorting, and pagination
- 💳 **Checkout Flow** - Complete order placement with address form
- 👤 **User Authentication** - JWT-based login/register
- 📊 **Admin Dashboard** - Sales analytics with charts and order management

### Backend
- 🔐 **JWT Authentication** - Secure token-based authentication
- 👮 **Role-based Authorization** - Admin and User roles
- 🛡️ **Security** - BCrypt password encryption, CORS configuration
- 📚 **API Documentation** - Swagger/OpenAPI integration
- 🗄️ **JPA/Hibernate** - Database operations with Spring Data JPA
- ✅ **Validation** - Input validation with custom error handling

## 🏗 Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (Build tool)
- Tailwind CSS (Styling)
- React Router (Routing)
- Framer Motion (Animations)
- Axios (HTTP client)
- Lucide React (Icons)
- Recharts (Charts)

### Backend
- Spring Boot 3.2
- Java 17
- Spring Security + JWT
- Spring Data JPA
- MySQL Driver
- Lombok
- Swagger/OpenAPI

### Database
- MySQL 8.0

### DevOps
- Docker & Docker Compose
- Nginx (Production server)

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Java 17+
- MySQL 8.0+
- Docker (optional)

### Option 1: Local Development

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd ammas-pastries
```

#### 2. Setup Database
```bash
# Create MySQL database
mysql -u root -p < database/schema.sql
```

#### 3. Start Backend
```bash
cd backend
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

#### 4. Start Frontend
```bash
# In a new terminal
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

### Option 2: Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost
# Backend API: http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui.html
```

## 📁 Project Structure

```
ammas-pastries/
├── src/                          # React Frontend
│   ├── components/               # Reusable components
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── context/                  # React Context
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── pages/                    # Page components
│   │   ├── Home.tsx
│   │   ├── Shop.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── Orders.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── NotFound.tsx
│   ├── services/                 # API services
│   │   └── api.ts
│   ├── types/                    # TypeScript types
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── backend/                      # Spring Boot Backend
│   ├── src/main/java/com/ammas/pastries/
│   │   ├── config/              # Configuration classes
│   │   ├── controller/          # REST controllers
│   │   ├── dto/                 # Data Transfer Objects
│   │   ├── entity/              # JPA entities
│   │   ├── exception/           # Exception handlers
│   │   ├── repository/          # JPA repositories
│   │   ├── security/            # Security config & JWT
│   │   └── service/             # Business logic
│   └── src/main/resources/
│       ├── application.properties
│       └── application-prod.properties
├── database/
│   └── schema.sql               # Database schema
├── docker/                      # Docker configurations
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── nginx.conf
├── docker-compose.yml
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products (Public)
- `GET /api/products` - Get all products (with pagination, filter, sort)
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/featured` - Get featured products
- `GET /api/products/categories` - Get all categories

### Products (Admin)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/{id}` - Update product
- `DELETE /api/admin/products/{id}` - Delete product

### Orders
- `GET /api/orders/user` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/{id}` - Get order by ID

### Orders (Admin)
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/{orderId}/status` - Update order status

### Reviews
- `GET /api/reviews/product/{productId}` - Get product reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/{reviewId}` - Update review
- `DELETE /api/reviews/{reviewId}` - Delete review

### Dashboard (Admin)
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

## 🎨 Design System

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Imperial Gold | `#F4A300` | Primary brand color |
| Imperial Dark | `#D48806` | Secondary/ hover states |
| Imperial Cream | `#FFF8E7` | Background |
| Imperial Soft | `#F5E6CA` | Accent/ cards |
| Imperial Brown | `#4A2C2A` | Text |

### Typography
- **Display**: Playfair Display (Headings)
- **Body**: Inter (Body text)

## 👤 Default Credentials

### Admin Account
- Email: `admin@ammaspastries.com`
- Password: `admin123`

## 🛠 Development

### Frontend Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Development
```bash
./mvnw spring-boot:run           # Start Spring Boot
./mvnw clean package             # Build JAR
./mvnw test                      # Run tests
```

### Database
```bash
# Access MySQL
mysql -u root -p

# Use database
USE ammas_pastries;

# View tables
SHOW TABLES;
```

## 🐳 Docker Commands

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild
docker-compose up -d --build

# Remove volumes
docker-compose down -v
```

## 📱 Screenshots

### Home Page
![Home](https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800)

### Product Grid
![Shop](https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800)

### Admin Dashboard
![Dashboard](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Images from Unsplash
- Icons from Lucide React
- UI Components from shadcn/ui

---

Made with ❤️ and 🍰 by AMMAS Pastries Team
