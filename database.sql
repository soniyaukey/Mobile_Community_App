-- =============================================================================
-- Community Mobile App for Local Services - MySQL Database Schema
-- =============================================================================
-- Database Name: localservicesdb
-- =============================================================================

-- Drop database if exists and create fresh
DROP DATABASE IF EXISTS localservicesdb;
CREATE DATABASE localservicesdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE localservicesdb;

-- =============================================================================
-- TABLE: users
-- =============================================================================
-- Core user table for authentication and profile management
-- =============================================================================

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('USER', 'PROVIDER', 'ADMIN') NOT NULL DEFAULT 'USER',
    profile_image VARCHAR(500),
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_users_email (email),
    INDEX idx_users_role (role),
    INDEX idx_users_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: categories
-- =============================================================================
-- Service categories (Plumbing, Electrical, Carpentry, etc.)
-- =============================================================================

CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_categories_name (name),
    INDEX idx_categories_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: providers
-- =============================================================================
-- Service provider profiles linked to users
-- =============================================================================

CREATE TABLE providers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    business_name VARCHAR(200) NOT NULL,
    description TEXT,
    experience_years INT DEFAULT 0,
    hourly_rate DECIMAL(10, 2),
    verification_status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    service_area_radius INT DEFAULT 25, -- in kilometers
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_providers_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_providers_category FOREIGN KEY (category_id) 
        REFERENCES categories(id) ON DELETE RESTRICT,
    
    INDEX idx_providers_user_id (user_id),
    INDEX idx_providers_category_id (category_id),
    INDEX idx_providers_verification (verification_status),
    INDEX idx_providers_rating (rating DESC),
    INDEX idx_providers_location (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: services
-- =============================================================================
-- Individual services offered by providers
-- =============================================================================

CREATE TABLE services (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    provider_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    duration_minutes INT DEFAULT 60,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_services_provider FOREIGN KEY (provider_id) 
        REFERENCES providers(id) ON DELETE CASCADE,
    CONSTRAINT fk_services_category FOREIGN KEY (category_id) 
        REFERENCES categories(id) ON DELETE RESTRICT,
    
    INDEX idx_services_provider_id (provider_id),
    INDEX idx_services_category_id (category_id),
    INDEX idx_services_price (price),
    INDEX idx_services_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: bookings
-- =============================================================================
-- Service bookings made by users
-- =============================================================================

CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    provider_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') 
        DEFAULT 'PENDING',
    total_amount DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_bookings_provider FOREIGN KEY (provider_id) 
        REFERENCES providers(id) ON DELETE RESTRICT,
    CONSTRAINT fk_bookings_service FOREIGN KEY (service_id) 
        REFERENCES services(id) ON DELETE RESTRICT,
    
    INDEX idx_bookings_user_id (user_id),
    INDEX idx_bookings_provider_id (provider_id),
    INDEX idx_bookings_service_id (service_id),
    INDEX idx_bookings_date (booking_date),
    INDEX idx_bookings_status (status),
    INDEX idx_bookings_user_status (user_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: payments
-- =============================================================================
-- Payment records for bookings
-- =============================================================================

CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL UNIQUE,
    payment_method ENUM('CASH', 'CARD', 'UPI', 'WALLET', 'BANK_TRANSFER') DEFAULT 'CASH',
    payment_status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED') 
        DEFAULT 'PENDING',
    transaction_id VARCHAR(100) UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_details JSON,
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_payments_booking FOREIGN KEY (booking_id) 
        REFERENCES bookings(id) ON DELETE CASCADE,
    
    INDEX idx_payments_booking_id (booking_id),
    INDEX idx_payments_status (payment_status),
    INDEX idx_payments_transaction_id (transaction_id),
    INDEX idx_payments_paid_at (paid_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: reviews
-- =============================================================================
-- User reviews for completed bookings
-- =============================================================================

CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    provider_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_reviews_booking FOREIGN KEY (booking_id) 
        REFERENCES bookings(id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_reviews_provider FOREIGN KEY (provider_id) 
        REFERENCES providers(id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_service FOREIGN KEY (service_id) 
        REFERENCES services(id) ON DELETE RESTRICT,
    
    INDEX idx_reviews_booking_id (booking_id),
    INDEX idx_reviews_user_id (user_id),
    INDEX idx_reviews_provider_id (provider_id),
    INDEX idx_reviews_rating (rating),
    INDEX idx_reviews_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: messages
-- =============================================================================
-- Chat messages between users and providers
-- =============================================================================

CREATE TABLE messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    message_text TEXT NOT NULL,
    message_type ENUM('TEXT', 'IMAGE', 'FILE') DEFAULT 'TEXT',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_messages_booking FOREIGN KEY (booking_id) 
        REFERENCES bookings(id) ON DELETE SET NULL,
    CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) 
        REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_messages_receiver FOREIGN KEY (receiver_id) 
        REFERENCES users(id) ON DELETE RESTRICT,
    
    INDEX idx_messages_booking_id (booking_id),
    INDEX idx_messages_sender_id (sender_id),
    INDEX idx_messages_receiver_id (receiver_id),
    INDEX idx_messages_is_read (is_read),
    INDEX idx_messages_conversation (sender_id, receiver_id),
    INDEX idx_messages_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: documents
-- =============================================================================
-- Provider verification documents (ID, certificates, etc.)
-- =============================================================================

CREATE TABLE documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    provider_id BIGINT NOT NULL,
    document_type ENUM('ID_PROOF', 'ADDRESS_PROOF', 'CERTIFICATION', 'LICENCE', 'OTHER') 
        NOT NULL,
    document_url VARCHAR(500) NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    rejection_reason TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    
    CONSTRAINT fk_documents_provider FOREIGN KEY (provider_id) 
        REFERENCES providers(id) ON DELETE CASCADE,
    
    INDEX idx_documents_provider_id (provider_id),
    INDEX idx_documents_type (document_type),
    INDEX idx_documents_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: provider_availability
-- =============================================================================
-- Provider weekly availability schedule
-- =============================================================================

CREATE TABLE provider_availability (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    provider_id BIGINT NOT NULL,
    day_of_week INT NOT NULL CHECK (day_of_week >= 1 AND day_of_week <= 7), -- 1=Monday, 7=Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_availability_provider FOREIGN KEY (provider_id) 
        REFERENCES providers(id) ON DELETE CASCADE,
    
    INDEX idx_availability_provider (provider_id),
    INDEX idx_availability_day (day_of_week),
    UNIQUE KEY uk_provider_day (provider_id, day_of_week)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: notifications
-- =============================================================================
-- Push notification records
-- =============================================================================

CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type ENUM('BOOKING', 'PAYMENT', 'REVIEW', 'MESSAGE', 'SYSTEM') DEFAULT 'SYSTEM',
    reference_id BIGINT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_notifications_user_id (user_id),
    INDEX idx_notifications_is_read (is_read),
    INDEX idx_notifications_type (notification_type),
    INDEX idx_notifications_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- SAMPLE DATA INSERTION
-- =============================================================================

-- Insert default categories
INSERT INTO categories (name, description, icon) VALUES
('Plumbing', 'Professional plumbers for pipe repair, leak fixing, and installation services', '🔧'),
('Electrical', 'Licensed electricians for wiring, repairs, and electrical installations', '⚡'),
('Carpentry', 'Skilled carpenters for furniture making, repairs, and woodwork', '🪵'),
('Tutoring', 'Expert tutors for academic subjects and test preparation', '📚'),
('Healthcare', 'Medical professionals and healthcare services', '🏥'),
('Delivery', 'Fast and reliable delivery services for packages and goods', '🚚'),
('Cleaning', 'Professional cleaning services for homes and offices', '🧹'),
('Home Repair', 'General home repair and maintenance services', '🏠'),
('Automotive', 'Car repair and maintenance services', '🚗'),
('Security', 'Security services and personnel', '🔒');

-- Insert sample admin user (password: admin123 - hashed with BCrypt)
INSERT INTO users (name, email, password, phone, role) VALUES
('System Admin', 'admin@localservices.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.CpIVrjLvBhQfT7PQ7u', '+1234567890', 'ADMIN');

-- Insert sample regular users (password: user123 - hashed with BCrypt)
INSERT INTO users (name, email, password, phone, role) VALUES
('John Smith', 'john.smith@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.CpIVrjLvBhQfT7PQ7u', '+1234567891', 'USER'),
('Sarah Johnson', 'sarah.johnson@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.CpIVrjLvBhQfT7PQ7u', '+1234567892', 'USER'),
('Mike Wilson', 'mike.wilson@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.CpIVrjLvBhQfT7PQ7u', '+1234567893', 'USER'),
('Emily Davis', 'emily.davis@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.CpIVrjLvBhQfT7PQ7u', '+1234567894', 'USER');

-- Insert sample service providers (password: provider123 - hashed with BCrypt)
INSERT INTO users (name, email, password, phone, role) VALUES
('Robert Plumber', 'robert.plumber@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.CpIVrjLvBhQfT7PQ7u', '+1234567901', 'PROVIDER'),
('Lisa Electrician', 'lisa.electrician@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.CpIVrjLvBhQfT7PQ7u', '+1234567902', 'PROVIDER'),
('David Carpenter', 'david.carpenter@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.CpIVrjLvBhQfT7PQ7u', '+1234567903', 'PROVIDER'),
('Jennifer Tutor', 'jennifer.tutor@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.CpIVrjLvBhQfT7PQ7u', '+1234567904', 'PROVIDER'),
('Mark Cleaner', 'mark.cleaner@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.CpIVrjLvBhQfT7PQ7u', '+1234567905', 'PROVIDER');

-- Insert provider profiles
INSERT INTO providers (user_id, category_id, business_name, description, experience_years, hourly_rate, verification_status, rating, total_reviews, is_available, address, latitude, longitude) VALUES
(5, 1, 'Robert Plumbing Services', 'Professional plumber with 15 years of experience in residential and commercial plumbing. Expert in leak detection, pipe repair, water heater installation, and emergency plumbing services.', 15, 75.00, 'APPROVED', 4.85, 120, TRUE, '123 Main Street, New York, NY', 40.7128, -74.0060),
(6, 2, 'Lisa Electrical Solutions', 'Licensed electrician providing top-quality electrical services. Specializing in wiring, panel upgrades, circuit repairs, and smart home installations.', 12, 85.00, 'APPROVED', 4.90, 98, TRUE, '456 Oak Avenue, New York, NY', 40.7580, -73.9855),
(7, 3, 'David Woodworks', 'Master carpenter offering custom furniture, cabinetry, and wood repair services. 20 years of craftsmanship experience.', 20, 65.00, 'APPROVED', 4.75, 85, TRUE, '789 Pine Road, New York, NY', 40.7489, -73.9680),
(8, 4, 'Jennifer Education Center', 'Professional tutoring services for all ages. Expert in math, science, English, and test preparation. Personalized learning plans.', 10, 50.00, 'APPROVED', 4.95, 150, TRUE, '321 Elm Street, New York, NY', 40.7614, -73.9776),
(9, 7, 'Sparkle Clean Services', 'Professional cleaning services for homes and offices. We provide deep cleaning, regular maintenance, and move-in/move-out cleaning.', 8, 45.00, 'APPROVED', 4.80, 200, TRUE, '654 Maple Lane, New York, NY', 40.7549, -73.9840);

-- Insert services offered by providers
INSERT INTO services (provider_id, category_id, title, description, price, duration_minutes) VALUES
-- Robert Plumber services (provider_id = 1)
(1, 1, 'Leak Repair', 'Professional leak detection and repair service for all types of leaks', 75.00, 60),
(1, 1, 'Pipe Installation', 'Complete pipe installation for new constructions or replacements', 150.00, 120),
(1, 1, 'Water Heater Service', 'Water heater installation, repair, and maintenance', 125.00, 90),
(1, 1, 'Drain Cleaning', 'Professional drain cleaning and unclogging service', 80.00, 60),
(1, 1, 'Emergency Plumbing', '24/7 emergency plumbing service for urgent issues', 150.00, 60),

-- Lisa Electrician services (provider_id = 2)
(2, 2, 'Electrical Wiring', 'Complete electrical wiring for residential properties', 200.00, 180),
(2, 2, 'Circuit Repair', 'Electrical circuit repair and troubleshooting', 85.00, 60),
(2, 2, 'Panel Upgrade', 'Electrical panel upgrade and replacement', 350.00, 240),
(2, 2, 'Smart Home Installation', 'Smart home device installation and setup', 150.00, 120),
(2, 2, 'Light Fixture Installation', 'Interior and exterior light fixture installation', 75.00, 60),

-- David Carpenter services (provider_id = 3)
(3, 3, 'Custom Furniture', 'Bespoke furniture design and creation', 500.00, 480),
(3, 3, 'Cabinet Installation', 'Kitchen and bathroom cabinet installation', 350.00, 360),
(3, 3, 'Wood Repair', 'Furniture repair and restoration', 100.00, 90),
(3, 3, 'Deck Building', 'Custom deck design and construction', 800.00, 600),

-- Jennifer Tutor services (provider_id = 4)
(4, 4, 'Math Tutoring', 'Mathematics tutoring for all levels', 50.00, 60),
(4, 4, 'Science Tutoring', 'Physics, Chemistry, Biology tutoring', 55.00, 60),
(4, 4, 'SAT Prep', 'SAT test preparation course', 75.00, 90),
(4, 4, 'English Language', 'English language and literature tutoring', 45.00, 60),

-- Mark Cleaner services (provider_id = 5)
(5, 7, 'Home Cleaning', 'Complete home cleaning service', 80.00, 120),
(5, 7, 'Office Cleaning', 'Professional office cleaning', 100.00, 120),
(5, 7, 'Deep Cleaning', 'Thorough deep cleaning service', 150.00, 180),
(5, 7, 'Move-in/Move-out', 'End of lease cleaning', 200.00, 240);

-- Insert sample bookings
INSERT INTO bookings (user_id, provider_id, service_id, booking_date, booking_time, status, total_amount, address) VALUES
(2, 1, 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '10:00:00', 'CONFIRMED', 75.00, '100 User Street, New York, NY'),
(3, 2, 6, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '14:00:00', 'PENDING', 85.00, '200 Client Avenue, New York, NY'),
(4, 5, 17, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '09:00:00', 'CONFIRMED', 80.00, '300 Customer Road, New York, NY'),
(2, 3, 11, DATE_SUB(CURDATE(), INTERVAL 5 DAY), '11:00:00', 'COMPLETED', 500.00, '100 User Street, New York, NY'),
(3, 4, 13, DATE_SUB(CURDATE(), INTERVAL 10 DAY), '15:00:00', 'COMPLETED', 50.00, '200 Client Avenue, New York, NY');

-- Insert payments for completed bookings
INSERT INTO payments (booking_id, payment_method, payment_status, transaction_id, amount, paid_at) VALUES
(4, 'CARD', 'COMPLETED', 'TXN001234567', 500.00, DATE_SUB(CURDATE(), INTERVAL 5 DAY)),
(5, 'UPI', 'COMPLETED', 'TXN001234568', 50.00, DATE_SUB(CURDATE(), INTERVAL 10 DAY));

-- Insert reviews for completed bookings
INSERT INTO reviews (booking_id, user_id, provider_id, service_id, rating, comment) VALUES
(4, 2, 3, 11, 5, 'Excellent work! The custom furniture is beautiful and exactly what I wanted. David was professional and completed the work on time.'),
(5, 3, 4, 13, 5, 'Jennifer is an amazing tutor. My son improved significantly in math within just a few sessions. Highly recommended!');

-- Update provider ratings based on reviews
UPDATE providers p 
SET p.rating = (
    SELECT COALESCE(AVG(r.rating), 0) 
    FROM reviews r 
    WHERE r.provider_id = p.id AND r.is_approved = TRUE
),
p.total_reviews = (
    SELECT COUNT(*) 
    FROM reviews r 
    WHERE r.provider_id = p.id AND r.is_approved = TRUE
);

-- Insert sample messages
INSERT INTO messages (booking_id, sender_id, receiver_id, message_text, message_type) VALUES
(1, 2, 5, 'Hi, I would like to book your leak repair service for tomorrow.', 'TEXT'),
(1, 5, 2, 'Hello! Yes, I am available tomorrow at 10 AM. Please confirm the address.', 'TEXT'),
(1, 2, 5, 'The address is 100 User Street, New York, NY. Is that okay?', 'TEXT'),
(1, 5, 2, 'Perfect! I will be there. Please ensure access to the affected area.', 'TEXT');

-- Insert provider availability (Monday to Friday, 9 AM to 6 PM)
INSERT INTO provider_availability (provider_id, day_of_week, start_time, end_time, is_available) VALUES
(1, 1, '09:00:00', '18:00:00', TRUE),
(1, 2, '09:00:00', '18:00:00', TRUE),
(1, 3, '09:00:00', '18:00:00', TRUE),
(1, 4, '09:00:00', '18:00:00', TRUE),
(1, 5, '09:00:00', '18:00:00', TRUE),
(2, 1, '08:00:00', '20:00:00', TRUE),
(2, 2, '08:00:00', '20:00:00', TRUE),
(2, 3, '08:00:00', '20:00:00', TRUE),
(2, 4, '08:00:00', '20:00:00', TRUE),
(2, 5, '08:00:00', '20:00:00', TRUE),
(2, 6, '10:00:00', '16:00:00', TRUE),
(3, 2, '10:00:00', '19:00:00', TRUE),
(3, 3, '10:00:00', '19:00:00', TRUE),
(3, 4, '10:00:00', '19:00:00', TRUE),
(3, 5, '10:00:00', '19:00:00', TRUE),
(3, 6, '10:00:00', '17:00:00', TRUE),
(4, 1, '15:00:00', '20:00:00', TRUE),
(4, 2, '15:00:00', '20:00:00', TRUE),
(4, 3, '15:00:00', '20:00:00', TRUE),
(4, 4, '15:00:00', '20:00:00', TRUE),
(4, 5, '15:00:00', '20:00:00', TRUE),
(4, 6, '09:00:00', '14:00:00', TRUE),
(5, 1, '07:00:00', '15:00:00', TRUE),
(5, 2, '07:00:00', '15:00:00', TRUE),
(5, 3, '07:00:00', '15:00:00', TRUE),
(5, 4, '07:00:00', '15:00:00', TRUE),
(5, 5, '07:00:00', '15:00:00', TRUE),
(5, 6, '08:00:00', '12:00:00', TRUE);

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, notification_type, reference_id) VALUES
(2, 'Booking Confirmed', 'Your plumbing service has been confirmed for tomorrow at 10:00 AM', 'BOOKING', 1),
(3, 'New Booking Request', 'You have a new booking request from John Smith', 'BOOKING', 2),
(4, 'Booking Completed', 'Your cleaning service has been completed. Please leave a review.', 'BOOKING', 3),
(2, 'Review Received', 'Thank you for your review! It helps other users make informed decisions.', 'REVIEW', 4),
(5, 'Payment Received', 'You received a payment of $500.00 for custom furniture service', 'PAYMENT', 4);

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Check table creation
SELECT 'Tables created successfully!' AS Status;

-- Show all tables
SHOW TABLES;

-- Count records in each table
SELECT 
    (SELECT COUNT(*) FROM users) AS users_count,
    (SELECT COUNT(*) FROM categories) AS categories_count,
    (SELECT COUNT(*) FROM providers) AS providers_count,
    (SELECT COUNT(*) FROM services) AS services_count,
    (SELECT COUNT(*) FROM bookings) AS bookings_count,
    (SELECT COUNT(*) FROM payments) AS payments_count,
    (SELECT COUNT(*) FROM reviews) AS reviews_count,
    (SELECT COUNT(*) FROM messages) AS messages_count;

-- =============================================================================
-- END OF DATABASE SCRIPT
-- =============================================================================
