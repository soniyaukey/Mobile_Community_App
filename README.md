# Local Services Community App 🏠🔧

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-green)](https://spring.io/projects/spring-boot)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-54-orange)](https://expo.dev)
[![Java](https://img.shields.io/badge/Java-21-red)](https://openjdk.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://typescriptlang.org)

A **comprehensive cross-platform mobile application** connecting residents with **local service providers** (plumbers, electricians, carpenters, tutors, healthcare, delivery, etc.). Features **real-time booking**, **in-app chat**, **secure payments**, **ratings/reviews**, and **provider verification**.

## ✨ Key Features

### **User Features** 🚀
- 🔐 JWT Authentication (Register/Login)
- 🗺️ GPS-based Nearby Service Search
- 📱 Provider Profiles with Photos & Reviews
- 📅 Service Booking with Calendar Scheduling
- 💬 Real-time In-app Chat Messaging
- 💳 Secure Payment Processing (simulated)
- ⭐ Rating & Review System
- 📊 My Bookings & History

### **Provider Features** 👨‍🔧
- 📝 Service Listing Management
- ⏰ Availability Scheduling
- 📱 Booking Request Handling
- 💰 Earnings Dashboard
- 📄 Document Verification Workflow

### **Admin Features** 🛡️
- 👥 User & Provider Management
- ✅ Provider Approval/Rejection
- 📈 Platform Analytics Dashboard
- ⚠️ Complaint Resolution

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Backend** | Spring Boot 3.2.0 (Java 21), JPA/Hibernate, JWT Security |
| **Database** | H2 (embedded dev) / MySQL 8.x (prod) |
| **Frontend** | React Native + Expo 54 (TypeScript), React Navigation |
| **UI Library** | React Native Paper |
| **Maps** | react-native-maps |
| **State** | React Context + AsyncStorage |
| **API Client** | Axios |
| **Build** | Maven (backend), npm/yarn (frontend) |

## 📂 Project Structure

```
moblie_community_app/
├── README.md                 # 📄 This file
├── SPEC.md                   # 📋 Detailed specifications
├── database.sql              # 🗄️ MySQL schema + sample data
├── run.bat / run.ps1         # 🚀 One-click start scripts
│
├── backend/                  # Spring Boot API
│   ├── pom.xml
│   ├── src/main/java/com/localservices/
│   │   ├── LocalServicesApplication.java
│   │   ├── config/           # SecurityConfig, DataInitializer
│   │   ├── controller/       # Auth, Provider, Booking, etc.
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── entity/           # User, Provider, Booking, etc.
│   │   ├── repository/       # JPA Repositories
│   │   ├── security/         # JWT Filter, Token Provider
│   │   └── service/          # Business Logic
│   └── src/main/resources/application.yml
│
└── frontend/                 # React Native Mobile App
    ├── App.tsx
    ├── package.json
    ├── src/
    │   ├── screens/          # Login, Home, Booking, Chat, etc.
    │   ├── components/       # Reusable UI
    │   ├── context/          # AuthContext
    │   ├── services/api.ts   # API calls
    │   ├── theme/
    │   └── types/
    └── tsconfig.json
```

## 🚀 Quick Start (5 Minutes)

### **Prerequisites**
- **Windows**: Java 21+, Maven 3.8+, Node.js 18+, Expo CLI (`npm i -g @expo/cli`)
- **Database**: None needed (uses embedded H2) or MySQL 8.x

### **Option 1: One-Click Scripts** (Recommended)
```powershell
# PowerShell (Windows)
.\run.ps1

# Or CMD
run.bat
```
This starts **backend on http://localhost:8090** + **frontend Expo dev server**.

### **Option 2: Manual Setup**

1. **Backend** (Port: 8090)
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   - API Docs: http://localhost:8090/swagger-ui.html
   - H2 Console: http://localhost:8090/h2-console

2. **Frontend** (in new terminal)
   ```bash
   cd frontend
   npm install
   npx expo start
   ```
   - **Web**: Press `w`
   - **Android**: Press `a` (or Expo Go app)
   - **iOS**: Press `i` (macOS)

## 🗄️ Database Setup (Optional - MySQL)

1. Run `database.sql` in MySQL:
   ```sql
   CREATE DATABASE local_services_db;
   -- Import full schema + sample data
   ```

2. Update `backend/src/main/resources/application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/local_services_db
       username: root
       password: root
     jpa:
       hibernate:
         ddl-auto: validate  # or update
   ```

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register user | No |
| `POST` | `/api/auth/login` | JWT Login | No |
| `GET` | `/api/providers` | List providers | Yes |
| `GET` | `/api/providers/search` | Search by category/location | Yes |
| `POST` | `/api/bookings` | Create booking | Yes |
| `GET` | `/api/bookings/user/{id}` | User bookings | Yes |
| `POST` | `/api/reviews` | Add review | Yes |
| `GET` | `/api/messages/chat/{bookingId}` | Chat messages | Yes |
| `GET` | `/api/admin/dashboard` | Admin stats | Admin |

**Full OpenAPI Docs**: http://localhost:8090/swagger-ui.html

## 🎨 Service Categories

🔧 Plumbing | ⚡ Electrical | 🪵 Carpentry | 📚 Tutoring | 🏥 Healthcare | 🚚 Delivery | 🧹 Cleaning | 🚗 Automotive | 🔒 Security

## 📱 App Screens Flow

```
Splash → Login/Register → Home (Search/Categories)
     ↳ Provider Detail → Booking → Payment
     ↳ My Bookings → Chat
     ↳ Profile → Edit Profile
```

**Screens Implemented**:
- HomeScreen, SearchScreen, ProviderDetailScreen
- BookingScreen, MyBookingsScreen, ChatScreen
- LoginScreen, RegisterScreen, ProfileScreen
- SplashScreen + Navigation

## ⚙️ Configuration

### Backend (application.yml)
- **Port**: 8090
- **DB**: H2 embedded (dev) / MySQL (prod)
- **JWT**: 24h expiration, configurable secret
- **Hibernate**: `create-drop` (dev resets data)

### Frontend (.env or app.json)
```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://localhost:8090/api"
    }
  }
}
```

## 🧪 Testing Credentials

| Email | Password | Role |
|-------|----------|------|
| `admin@localservices.com` | `admin123` | Admin |
| `john.smith@email.com` | `user123` | User |
| `robert.plumber@email.com` | `provider123` | Provider |

**Sample Data**: Providers, bookings, reviews, messages pre-loaded.

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Port 8090 busy** | Kill process: `netstat -ano \| findstr :8090` |
| **H2 Console 404** | Access: `/h2-console` (JDBC: `jdbc:h2:mem:localservicesdb`) |
| **CORS errors** | Backend auto-configured for frontend origins |
| **Maps not loading** | Enable location perms in Expo Go |
| **Build fails** | `mvn clean install` / `npm ci` |

## 📈 Demo Screenshots

<!-- Add screenshots here -->
1. [Home Screen](./screenshots/home.png)
2. [Provider Search](./screenshots/search.png)
3. [Booking Flow](./screenshots/booking.png)
4. [Chat Interface](./screenshots/chat.png)

## 🤝 Contributing

1. Fork & clone
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'Add: amazing feature'`
4. Push & PR

**Code Style**:
- Backend: [Google Java Style](https://google.github.io/styleguide/javaguide.html)
- Frontend: Prettier + ESLint

## 📄 License

MIT License - Free for personal/educational use.

## 👨‍💻 Author

Built for community service marketplace. Questions? Check `SPEC.md` or open issue.

---

**⭐ Star this repo if helpful!**
#   M o b i l e _ C o m m u n i t y _ A p p  
 