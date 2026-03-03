# 🏠 HomeHive - MERN Stack House Rent Application

HomeHive is a premium, feature-rich house rental platform built using the MERN stack (MongoDB, Express.js, React, Node.js). It provides a seamless experience for Renters to find homes, Owners to list properties, and Admins to manage the entire ecosystem.

---

## ✨ Key Features

### 🔐 Multi-Role Authentication
- **Secure Signup/Login**: Role-based access for Renters, Owners, and Admins.
- **OTP Verification**: Email verification via OTP and Cloudflare Turnstile CAPTCHA integration.
- **Profile Management**: Customizable user profiles with photo upload and bilingual support (English/Hindi).

### 🏠 Property Ecosystem
- **Advanced Search & Filter**: Search by location, price, BHK type, and amenities.
- **Interactive Listings**: Property cards with image galleries, maps, and similar property suggestions.
- **Comparison Tool**: Compare up to 3 properties side-by-side to make informed decisions.
- **Owner Dashboard**: Comprehensive tools for owners to add, edit, and track property performance.

### 📅 Booking & Payments
- **Availability Calendar**: Real-time availability tracking for properties.
- **Secure Payments**: Integrated with **Razorpay** for UPI, Cards, and Net Banking.
- **Booking Management**: Track upcoming, active, and completed stays with automated receipts.

### 🎨 Premium UI/UX
- **Modern Design**: Sleek dark theme with glassmorphism effects and smooth Framer Motion animations.
- **Responsive & Mobile-First**: Optimized for all devices from mobile to large desktops.
- **Real-Time Notifications**: In-app and email alerts for bookings, payments, and system updates.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js with Vite
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt.js
- **Payments**: Razorpay Node SDK
- **Email**: Nodemailer

---

## 📁 Project Structure

```text
house_rent/
├── backend/             # Express server and Node.js logic
│   ├── src/
│   │   ├── config/      # Database and Mail configurations
│   │   ├── middlewares/ # Auth and Error handlers
│   │   ├── modules/     # Feature-based MVC modules (Auth, Property, Booking, etc.)
│   │   └── utils/       # OTP and Token helpers
│   └── server.js        # Entry point
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI parts
│   │   ├── pages/       # View layers
│   │   ├── services/    # API communication
│   │   └── store/       # State management (Zustand)
│   └── vite.config.js
└── package.json         # Root scripts for concurrent execution
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16.x or higher)
- MongoDB Atlas account or local MongoDB
- Razorpay API Keys
- Cloudflare Turnstile Site Key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd house_rent
   ```

2. **Install Dependencies (All at once)**
   ```bash
   npm run install-all
   ```

3. **Environment Variables**
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   ```

4. **Run the Application**
   ```bash
   npm run dev
   ```
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000`

---

## 🛡️ Security & Best Practices
- **Input Validation**: Strict schema validation using Mongoose.
- **Security Middlewares**: JWT protection and role-based route restriction.
- **Error Handling**: Centralized error middleware for consistent API responses.
- **API Design**: RESTful conventions followed throughout the platform.

---

## 📄 License
This project is licensed under the ISC License.

Developed with ❤️ as **HomeHive**.
