# Community Mobile App for Local Services - Specification

## 1. Project Overview

**Project Name:** LocalServices Community App  
**Type:** Cross-platform Mobile Application  
**Core Functionality:** A community platform connecting residents with local service providers (plumbers, electricians, carpenters, tutors, healthcare workers, delivery agents) featuring booking, scheduling, chat, payments, and reviews.  
**Target Users:** Residents seeking local services, Service Providers looking for customers, Administrators managing the platform.

---

## 2. Technology Stack

### Backend
- **Framework:** Spring Boot 3.x
- **Language:** Java 17
- **Database:** MySQL 8.x
- **Authentication:** JWT (JSON Web Tokens)
- **API Documentation:** SpringDoc OpenAPI
- **Build Tool:** Maven

### Frontend
- **Framework:** React Native with Expo
- **Language:** TypeScript
- **State Management:** React Context API + AsyncStorage
- **Navigation:** React Navigation 6
- **HTTP Client:** Axios
- **UI Components:** React Native Paper

---

## 3. UI/UX Specification

### Color Palette
- **Primary:** #2563EB (Blue - trust, reliability)
- **Primary Dark:** #1D4ED8
- **Primary Light:** #3B82F6
- **Secondary:** #10B981 (Green - success, growth)
- **Accent:** #F59E0B (Amber - attention, ratings)
- **Error:** #EF4444 (Red)
- **Background:** #F8FAFC (Light gray)
- **Surface:** #FFFFFF (White)
- **Text Primary:** #1E293B
- **Text Secondary:** #64748B
- **Border:** #E2E8F0

### Typography
- **Font Family:** System default (San Francisco on iOS, Roboto on Android)
- **Heading 1:** 28px, Bold
- **Heading 2:** 24px, SemiBold
- **Heading 3:** 20px, SemiBold
- **Body:** 16px, Regular
- **Caption:** 14px, Regular
- **Small:** 12px, Regular

### Spacing System (8pt Grid)
- **xs:** 4px
- **sm:** 8px
- **md:** 16px
- **lg:** 24px
- **xl:** 32px
- **xxl:** 48px

### Screen Structure

#### User App Screens
1. **Splash Screen** - App logo, loading animation
2. **Onboarding Screens** - 3 intro screens with illustrations
3. **Login Screen** - Email/password, social login options
4. **Register Screen** - Multi-step registration form
5. **Home Screen** - Categories grid, featured providers, search bar
6. **Search Results Screen** - Filterable list of providers
7. **Provider Detail Screen** - Full profile, reviews, booking button
8. **Booking Screen** - Date/time selection, service details
9. **My Bookings Screen** - List of past/upcoming bookings
10. **Chat List Screen** - All conversations
11. **Chat Screen** - Individual conversation
12. **Profile Screen** - User details, settings
13. **Edit Profile Screen** - Update personal information
14. **Payment Screen** - Payment method selection, transaction history
15. **Reviews Screen** - Write/view reviews

#### Provider App Screens
1. **Provider Login/Register**
2. **Provider Dashboard** - Earnings, bookings overview
3. **Service Management** - Add/edit services
4. **Availability Schedule** - Set working hours
5. **Booking Requests** - Accept/reject bookings
6. **Provider Profile** - Business info, photos
7. **Provider Reviews** - View customer feedback
8. **Earnings Dashboard** - Revenue charts, withdrawals

#### Admin Panel (Web-based)
1. **Dashboard** - Statistics, reports
2. **User Management** - View/manage users
3. **Provider Management** - Approve/reject providers
4. **Booking Management** - Monitor all bookings
5. **Complaint Handling** - Process user complaints
6. **Settings** - App configuration

---

## 4. Feature Specification

### User Module
- [x] User Registration (name, email, phone, password, address)
- [x] User Login with JWT authentication
- [x] Profile management (view, edit personal info)
- [x] Search services by category (dropdown, icons)
- [x] Filter by location (GPS-based or manual)
- [x] View provider details (ratings, reviews, pricing, photos)
- [x] Book services with date/time selection
- [x] In-app chat messaging
- [x] In-app voice call option
- [x] Secure payment integration (simulated)
- [x] Rating and review system

### Service Provider Module
- [x] Provider registration with document upload
- [x] Document verification workflow (pending/approved/rejected)
- [x] Service listing management (CRUD)
- [x] Availability scheduling (weekly schedule)
- [x] Booking request management (accept/reject)
- [x] Earnings dashboard with revenue tracking
- [x] Profile management

### Admin Module
- [x] Admin dashboard with statistics
- [x] User management (view, disable)
- [x] Provider approval/rejection
- [x] Booking monitoring
- [x] Complaint handling
- [x] Payment monitoring

### Technical Features
- [x] JWT-based authentication
- [x] GPS location services
- [x] Push notifications (Expo Notifications)
- [x] Role-based access control
- [x] RESTful API design

---

## 5. Database Schema

### Users Table
- id, email, password, name, phone, address, role (USER/PROVIDER/ADMIN), profile_image, created_at, updated_at

### Providers Table
- id, user_id, business_name, description, service_category, hourly_rate, rating, is_verified, address, latitude, longitude, created_at

### Services Table
- id, provider_id, name, description, price, duration_minutes, category

### Bookings Table
- id, user_id, provider_id, service_id, status (PENDING/CONFIRMED/COMPLETED/CANCELLED), scheduled_date, scheduled_time, total_amount, payment_status, notes, created_at

### Reviews Table
- id, booking_id, user_id, provider_id, rating (1-5), comment, created_at

### Messages Table
- id, sender_id, receiver_id, booking_id, content, is_read, created_at

### Documents Table
- id, provider_id, document_type, document_url, status, uploaded_at

---

## 6. API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile
- PUT /api/auth/profile

### Users
- GET /api/users/{id}
- PUT /api/users/{id}

### Providers
- GET /api/providers
- GET /api/providers/{id}
- GET /api/providers/search?category=&lat=&lng=
- POST /api/providers (register as provider)
- PUT /api/providers/{id}
- PUT /api/providers/{id}/availability

### Services
- GET /api/providers/{id}/services
- POST /api/providers/{id}/services
- PUT /api/services/{id}
- DELETE /api/services/{id}

### Bookings
- POST /api/bookings
- GET /api/bookings/user/{userId}
- GET /api/bookings/provider/{providerId}
- PUT /api/bookings/{id}/status
- POST /api/bookings/{id}/payment

### Reviews
- POST /api/reviews
- GET /api/reviews/provider/{providerId}

### Messages
- GET /api/messages/chat/{bookingId}
- POST /api/messages

### Admin
- GET /api/admin/dashboard
- GET /api/admin/providers/pending
- PUT /api/admin/providers/{id}/verify
- GET /api/admin/users
- GET /api/admin/complaints

---

## 7. Project Structure

```
moblie_community_app/
├── backend/                 # Spring Boot Backend
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/
│   │       │       └── local services/
│   │       │           ├── LocalServicesApplication.java
│   │       │           ├── config/
│   │       │           ├── controller/
│   │       │           ├── dto/
│   │       │           ├── entity/
│   │       │           ├── repository/
│   │       │           ├── security/
│   │       │           └── service/
│   │       └── resources/
│   │           └── application.yml
│   └── pom.xml
│
├── frontend/                # React Native Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── navigation/
│   │   ├── services/
│   │   ├── context/
│   │   ├── utils/
│   │   └── theme/
│   ├── App.tsx
│   └── package.json
│
└── SPEC.md
```

---

## 8. Acceptance Criteria

1. **Authentication:** Users can register, login, and logout securely
2. **Search:** Users can search providers by category and location
3. **Booking:** Users can book services with scheduling
4. **Provider Management:** Providers can manage services and bookings
5. **Admin Control:** Admins can manage users and providers
6. **UI/UX:** Clean, intuitive interface following the design spec
7. **Performance:** App loads within 3 seconds on average connection

---

## 9. Service Categories

1. 🔧 Plumbing
2. ⚡ Electrical
3. 🪵 Carpentry
4. 📚 Tutoring
5. 🏥 Healthcare
6. 🚚 Delivery
7. 🧹 Cleaning
8. 🛒 Shopping
9. 🔒 Security
10. 🚗 Automotive
