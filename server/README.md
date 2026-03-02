# HomeHive Backend Server

This is the Node.js + Express backend for the HomeHive application, handling Razorpay payments and MongoDB storage for bookings.

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in this directory and fill in your details:
```env
# Razorpay Test Mode Keys (get from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXX

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/houserent

# Server Port
PORT=5000
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Server
```bash
# Production mode
npm start

# Development mode (with auto-restart)
npm run dev
```

## API Endpoints

- `POST /api/payment/create-order` - Creates a Razorpay order
- `POST /api/payment/verify` - Verifies payment signature and saves booking
- `GET /api/payment/bookings/:userId` - Fetches bookings for a user
- `GET /api/health` - Server health check
