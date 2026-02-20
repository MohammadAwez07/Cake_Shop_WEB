-- AMMAS Pastries - Premium Cake Shop Database Schema
-- MySQL Production-Ready Schema

CREATE DATABASE IF NOT EXISTS ammas_pastries 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE ammas_pastries;

-- Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products Table
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    image_url VARCHAR(500),
    stock INT DEFAULT 0,
    rating DECIMAL(2, 1) DEFAULT 5.0,
    review_count INT DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_featured (featured),
    INDEX idx_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders Table
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    total_price DECIMAL(12, 2) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING',
    delivery_address TEXT NOT NULL,
    delivery_city VARCHAR(100) NOT NULL,
    delivery_zip VARCHAR(20) NOT NULL,
    delivery_phone VARCHAR(20) NOT NULL,
    delivery_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order Items Table
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reviews Table
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product_review (user_id, product_id),
    INDEX idx_product_id (product_id),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cart Table (Optional - for persistent cart)
CREATE TABLE cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product_cart (user_id, product_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Sample Admin User (password: admin123 - BCrypt encoded)
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@ammaspastries.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzBZN0UfGNEKjN.K3MN3xVyH2xG', 'ADMIN');

-- Insert Sample Products
INSERT INTO products (name, description, price, category, image_url, stock, rating, review_count, featured) VALUES
('Royal Chocolate Truffle Cake', 'Decadent layers of rich chocolate sponge with Belgian truffle ganache, adorned with gold leaf accents', 89.99, 'Chocolate', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800', 25, 4.9, 128, TRUE),
('Strawberry Dream Delight', 'Light vanilla sponge layered with fresh strawberry compote and Swiss meringue buttercream', 74.99, 'Fruit', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800', 20, 4.8, 96, TRUE),
('Classic Red Velvet', 'Southern-style red velvet with cream cheese frosting and edible rose petals', 69.99, 'Classic', 'https://images.unsplash.com/photo-1586788680434-30d3246272e8?w=800', 30, 4.7, 85, TRUE),
('Salted Caramel Cheesecake', 'New York style cheesecake with homemade salted caramel sauce and pecan praline', 79.99, 'Cheesecake', 'https://images.unsplash.com/photo-1524351199678-941a58a3df26?w=800', 18, 4.9, 112, TRUE),
('Lemon Meringue Elegance', 'Zesty lemon curd filling with Italian meringue topping on buttery shortbread base', 64.99, 'Fruit', 'https://images.unsplash.com/photo-1519340333755-56e9c1d04579?w=800', 22, 4.6, 67, FALSE),
('Tiramisu Supreme', 'Authentic Italian tiramisu with espresso-soaked ladyfingers and mascarpone cream', 84.99, 'Classic', 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800', 15, 4.8, 94, FALSE),
('Raspberry Pistachio Layer', 'Almond sponge with pistachio cream and fresh raspberry coulis', 76.99, 'Fruit', 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800', 12, 4.7, 73, FALSE),
('Black Forest Gateau', 'Traditional German Black Forest with Kirsch-soaked cherries and whipped cream', 82.99, 'Classic', 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800', 20, 4.8, 88, FALSE),
('Mango Passion Fruit Cake', 'Tropical mango mousse with passion fruit curd and coconut dacquoise', 71.99, 'Fruit', 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800', 16, 4.5, 54, FALSE),
('Oreo Cookies & Cream', 'Chocolate cake with Oreo cookie buttercream and cookie crumbles', 66.99, 'Chocolate', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800', 28, 4.6, 79, FALSE),
('White Chocolate Raspberry', 'White chocolate sponge with raspberry filling and white chocolate ganache', 78.99, 'Chocolate', 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=800', 14, 4.7, 62, FALSE),
('Coffee Walnut Delight', 'Espresso-infused cake with walnut praline and coffee buttercream', 72.99, 'Classic', 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=800', 19, 4.6, 58, FALSE),
('Blueberry Lemon Pound Cake', 'Moist pound cake with fresh blueberries and lemon glaze', 54.99, 'Fruit', 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800', 35, 4.4, 45, FALSE),
('Nutella Hazelnut Cake', 'Chocolate hazelnut cake with Nutella frosting and roasted hazelnuts', 81.99, 'Chocolate', 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800', 17, 4.8, 91, FALSE),
('Coconut Cream Paradise', 'Light coconut sponge with coconut cream filling and toasted coconut flakes', 68.99, 'Classic', 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800', 21, 4.5, 52, FALSE),
('Earl Grey Tea Cake', 'Fragrant Earl Grey-infused cake with honey buttercream', 62.99, 'Classic', 'https://images.unsplash.com/photo-1519340333755-56e9c1d04579?w=800', 13, 4.6, 41, FALSE),
('Peanut Butter Chocolate', 'Rich chocolate cake with peanut butter frosting and chocolate ganache', 75.99, 'Chocolate', 'https://images.unsplash.com/photo-1602351447937-745cb720612f?w=800', 15, 4.7, 68, FALSE),
('Apple Cinnamon Streusel', 'Spiced apple cake with cinnamon streusel topping and caramel drizzle', 59.99, 'Fruit', 'https://images.unsplash.com/photo-1562007908-859b4ba9a1a8?w=800', 24, 4.5, 49, FALSE),
('Matcha Green Tea Cake', 'Japanese matcha sponge with white chocolate ganache and red bean filling', 77.99, 'Classic', 'https://images.unsplash.com/photo-1505253758473-96b701d2cd03?w=800', 11, 4.6, 37, FALSE),
('Vanilla Bean Celebration', 'Classic vanilla bean cake with vanilla buttercream and edible flowers', 65.99, 'Classic', 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800', 32, 4.7, 86, FALSE);

-- Insert Sample Reviews
INSERT INTO reviews (user_id, product_id, rating, comment, created_at) VALUES
(1, 1, 5, 'Absolutely divine! The chocolate was so rich and the gold leaf made it feel truly luxurious.', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(1, 2, 5, 'Fresh strawberries and perfect sweetness. My family loved it!', DATE_SUB(NOW(), INTERVAL 10 DAY)),
(1, 3, 4, 'Beautiful presentation and great taste. Cream cheese frosting was perfect.', DATE_SUB(NOW(), INTERVAL 15 DAY));

-- Verify data
SELECT 'Database setup complete!' AS status;
SELECT COUNT(*) AS total_products FROM products;
SELECT COUNT(*) AS featured_products FROM products WHERE featured = TRUE;
