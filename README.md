# 🏠 Local Services Community App

A cross-platform mobile application that connects residents with trusted local service providers such as plumbers, electricians, carpenters, tutors, healthcare professionals, delivery agents, and cleaning services. The platform enables users to search, book, communicate, and review service providers through a seamless and user-friendly experience.

---

## ✨ Features

### 🚀 User Features

* JWT Authentication (Register/Login)
* GPS-based nearby service search
* Provider profiles with ratings and reviews
* Service booking and scheduling
* Real-time in-app chat
* Secure payment simulation
* Booking history management
* Rating and review system

### 👨‍🔧 Provider Features

* Service listing management
* Availability scheduling
* Booking request handling
* Earnings dashboard
* Document verification workflow

### 🛡️ Admin Features

* User and provider management
* Provider approval and rejection
* Platform analytics dashboard
* Complaint handling and resolution

---

## 🛠️ Technology Stack

| Component        | Technology                                              |
| ---------------- | ------------------------------------------------------- |
| Backend          | Spring Boot 3.2.0, Java 21, JPA/Hibernate, JWT Security |
| Database         | H2 Database (Development), MySQL 8.x (Production)       |
| Frontend         | React Native + Expo 54 + TypeScript                     |
| UI Library       | React Native Paper                                      |
| Maps             | react-native-maps                                       |
| State Management | React Context + AsyncStorage                            |
| API Client       | Axios                                                   |
| Build Tools      | Maven, npm                                              |

---

## 📁 Project Structure

```text
mobile_community_app/
│
├── backend/
│   ├── config/
│   ├── controller/
│   ├── dto/
│   ├── entity/
│   ├── repository/
│   ├── security/
│   └── service/
│
├── frontend/
│   ├── screens/
│   ├── components/
│   ├── context/
│   ├── services/
│   ├── theme/
│   └── types/
│
├── README.md
├── SPEC.md
└── database.sql
```

---

## 🚀 Getting Started

### Backend

```bash
cd backend
mvn spring-boot:run
```

Runs on:

```text
http://localhost:8090
```

### Frontend

```bash
cd frontend
npm install
npx expo start
```

* Press **w** for Web
* Press **a** for Android
* Press **i** for iOS (macOS)

---

## 📡 API Endpoints

| Method | Endpoint                       | Description      |
| ------ | ------------------------------ | ---------------- |
| POST   | /api/auth/register             | Register user    |
| POST   | /api/auth/login                | User login       |
| GET    | /api/providers                 | Get providers    |
| GET    | /api/providers/search          | Search providers |
| POST   | /api/bookings                  | Create booking   |
| GET    | /api/bookings/user/{id}        | User bookings    |
| POST   | /api/reviews                   | Add review       |
| GET    | /api/messages/chat/{bookingId} | Chat messages    |
| GET    | /api/admin/dashboard           | Admin dashboard  |

---

## 🎨 Service Categories

* Plumbing
* Electrical
* Carpentry
* Tutoring
* Healthcare
* Delivery
* Cleaning
* Automotive
* Security

---

## 📱 Application Flow

```text
Splash Screen
      ↓
Login / Register
      ↓
Home Screen
      ↓
Provider Details
      ↓
Booking
      ↓
Payment
      ↓
Chat & Booking History
```

---

## 🔧 Development Configuration

* Backend Port: **8090**
* JWT Expiration: **24 Hours**
* Database: **H2 (Development) / MySQL (Production)**

---

## 🧪 Test Credentials

| Role     | Email                                                       | Password    |
| -------- | ----------------------------------------------------------- | ----------- |
| Admin    | [admin@localservices.com](mailto:admin@localservices.com)   | admin123    |
| User     | [john.smith@email.com](mailto:john.smith@email.com)         | user123     |
| Provider | [robert.plumber@email.com](mailto:robert.plumber@email.com) | provider123 |

---

## 📄 License

This project is released under the **MIT License** and is intended for educational and personal use.

---

## 👨‍💻 Author

Developed as a community service marketplace application to simplify access to trusted local services.

⭐ **If you found this project useful, consider giving it a star!**
