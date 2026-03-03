# 🏗️ HomeHive - MVC Architecture Documentation

## 📐 Architecture Overview

HomeHive follows the **Model-View-Controller (MVC)** architectural pattern with a clear separation between frontend and backend, ensuring maintainability, scalability, and code organization.

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT (View)                       │
│                    React + Vite                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Components → Pages → Services → Store           │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕ HTTP/REST API
┌─────────────────────────────────────────────────────────┐
│                   SERVER (Controller)                    │
│                  Node.js + Express                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Routes → Controllers → Services → Models        │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕ Mongoose ODM
┌─────────────────────────────────────────────────────────┐
│                    DATABASE (Model)                      │
│                       MongoDB                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Collections: users, properties, bookings, etc.  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 FRONTEND ARCHITECTURE (View Layer)

### Directory Structure

```
client/src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Layout.jsx
│   │   ├── Modal.jsx
│   │   └── NotificationPanel.jsx
│   ├── booking/        # Booking-specific components
│   │   ├── AvailabilityCalendar.jsx
│   │   └── MultiStepBooking.jsx
│   ├── property/       # Property-specific components
│   │   ├── PropertyCard.jsx
│   │   └── MapLocation.jsx
│   └── ui/             # Base UI components
│       ├── button.jsx
│       ├── badge.jsx
│       └── skeleton.jsx
│
├── pages/              # Page-level components (Views)
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── SignUp.jsx
│   ├── Profile.jsx
│   ├── AllProperties.jsx
│   ├── PropertyDetails.jsx
│   ├── CompareProperties.jsx
│   ├── RenterHome.jsx
│   ├── OwnerHome.jsx
│   ├── AdminHome.jsx
│   ├── AddProperty.jsx
│   ├── AboutUs.jsx
│   ├── ContactUs.jsx
│   ├── TermsAndConditions.jsx
│   └── PrivacyPolicy.jsx
│
├── services/           # API communication layer
│   └── api.js          # Axios instance & API calls
│
├── store/              # State management (Zustand)
│   ├── useAuthStore.js
│   └── useAppStore.js
│
├── data/               # Static data & configurations
│   ├── mockData.js
│   └── translations.js
│
├── utils/              # Helper functions
│   └── razorpay.js
│
├── hooks/              # Custom React hooks
│   └── useKeyboardShortcuts.js
│
├── App.jsx             # Root component with routing
├── main.jsx            # Entry point
└── index.css           # Global styles
```

### Component Hierarchy

```
App
├── Layout
│   ├── Header
│   │   ├── NotificationPanel
│   │   └── ProfileDropdown
│   ├── Outlet (Page Content)
│   └── Footer
│
└── Routes
    ├── Public Routes
    │   ├── Home
    │   ├── Login
    │   ├── SignUp
    │   ├── AllProperties
    │   ├── PropertyDetails
    │   └── Static Pages
    │
    └── Protected Routes
        ├── RenterHome
        ├── OwnerHome
        ├── AdminHome
        ├── Profile
        └── AddProperty
```

### State Management (Zustand)

#### useAuthStore.js
```javascript
State:
- user: User object
- token: JWT token
- isAuthenticated: Boolean
- loading: Boolean
- error: String

Actions:
- signup(userData)
- login(credentials)
- logout()
- getProfile()
- clearError()
```

#### useAppStore.js
```javascript
State:
- theme: 'dark' | 'light'
- language: 'en' | 'hi'
- notifications: Array
- savedPropertyIds: Array
- compareProperties: Array
- ownerProperties: Array

Actions:
- toggleTheme()
- setLanguage(lang)
- addNotification(notification)
- markAsRead(id)
- saveProperty(id)
- addToCompare(property)
```

### API Service Layer

```javascript
// services/api.js
const api = {
  // Auth
  signup: (data) => POST /api/auth/signup
  login: (data) => POST /api/auth/login
  getProfile: () => GET /api/auth/profile
  
  // Properties
  getProperties: (filters) => GET /api/properties
  getPropertyById: (id) => GET /api/properties/:id
  createProperty: (data) => POST /api/properties
  updateProperty: (id, data) => PUT /api/properties/:id
  
  // Bookings
  createBooking: (data) => POST /api/bookings
  getBookings: () => GET /api/bookings
  
  // Payments
  createOrder: (data) => POST /api/payments/create-order
  verifyPayment: (data) => POST /api/payments/verify
}
```

---

## ⚙️ BACKEND ARCHITECTURE (Controller + Model Layer)

### Directory Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.js      # MongoDB connection
│   │   └── mail.js          # Email configuration
│   │
│   ├── middlewares/         # Express middlewares
│   │   ├── auth.middleware.js    # JWT verification
│   │   └── error.middleware.js   # Error handling
│   │
│   ├── modules/             # Feature modules (MVC)
│   │   ├── auth/
│   │   │   ├── auth.model.js       # User schema
│   │   │   ├── auth.controller.js  # Auth logic
│   │   │   ├── auth.service.js     # Business logic
│   │   │   ├── auth.routes.js      # Route definitions
│   │   │   └── auth.validation.js  # Input validation
│   │   │
│   │   ├── property/
│   │   │   ├── property.model.js
│   │   │   ├── property.controller.js
│   │   │   ├── property.service.js
│   │   │   └── property.routes.js
│   │   │
│   │   ├── booking/
│   │   │   ├── booking.model.js
│   │   │   ├── booking.controller.js
│   │   │   ├── booking.service.js
│   │   │   └── booking.routes.js
│   │   │
│   │   ├── payment/
│   │   │   ├── payment.controller.js
│   │   │   └── payment.routes.js
│   │   │
│   │   ├── savedProperty/
│   │   │   ├── savedProperty.model.js
│   │   │   ├── savedProperty.controller.js
│   │   │   └── savedProperty.routes.js
│   │   │
│   │   ├── admin/
│   │   │   ├── admin.controller.js
│   │   │   └── admin.routes.js
│   │   │
│   │   └── contact/
│   │       ├── contact.controller.js
│   │       └── contact.routes.js
│   │
│   ├── routes/              # Main route aggregator
│   │   └── index.js
│   │
│   ├── utils/               # Utility functions
│   │   ├── generateOTP.js
│   │   └── generateToken.js
│   │
│   └── app.js               # Express app configuration
│
├── server.js                # Server entry point
├── package.json
└── .env                     # Environment variables
```

### MVC Pattern Implementation

#### 1. MODEL Layer (Data)

**Purpose**: Define data structure, validation, and database operations

**Example: auth.model.js**
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['renter', 'owner', 'admin'] },
  phone: String,
  address: String,
  profileImage: String,
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpiry: Date
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
```

**Example: property.model.js**
```javascript
const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  city: String,
  address: String,
  bhk: Number,
  propertyType: String,
  amenities: [String],
  images: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 0 }
}, { timestamps: true });
```

**Example: booking.model.js**
```javascript
const bookingSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  renter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentId: String,
  paymentStatus: String
}, { timestamps: true });
```

#### 2. CONTROLLER Layer (Request Handling)

**Purpose**: Handle HTTP requests, validate input, call services, send responses

**Example: auth.controller.js**
```javascript
const authService = require('./auth.service');

exports.signup = async (req, res, next) => {
  try {
    const userData = req.body;
    const result = await authService.createUser(userData);
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const result = await authService.authenticateUser(email, password, role);
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await authService.getUserProfile(userId);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
```

**Example: property.controller.js**
```javascript
exports.getAllProperties = async (req, res, next) => {
  try {
    const filters = req.query;
    const properties = await propertyService.getProperties(filters);
    
    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    next(error);
  }
};

exports.createProperty = async (req, res, next) => {
  try {
    const propertyData = req.body;
    const ownerId = req.user.id;
    
    const property = await propertyService.createProperty({
      ...propertyData,
      owner: ownerId
    });
    
    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: property
    });
  } catch (error) {
    next(error);
  }
};
```

#### 3. SERVICE Layer (Business Logic)

**Purpose**: Implement business logic, data processing, external API calls

**Example: auth.service.js**
```javascript
const User = require('./auth.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require('../../config/mail');
const { generateOTP } = require('../../utils/generateOTP');

exports.createUser = async (userData) => {
  // Check if user exists
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('User already exists');
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  // Generate OTP
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  // Create user
  const user = await User.create({
    ...userData,
    password: hashedPassword,
    otp,
    otpExpiry
  });
  
  // Send OTP email
  await sendOTPEmail(user.email, otp);
  
  // Generate token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  };
};

exports.authenticateUser = async (email, password, role) => {
  // Find user
  const user = await User.findOne({ email, role });
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  // Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }
  
  // Generate token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  };
};
```

**Example: booking.service.js**
```javascript
const Booking = require('./booking.model');
const Property = require('../property/property.model');

exports.createBooking = async (bookingData) => {
  // Check property availability
  const property = await Property.findById(bookingData.property);
  if (!property || !property.isAvailable) {
    throw new Error('Property not available');
  }
  
  // Check for conflicting bookings
  const conflictingBooking = await Booking.findOne({
    property: bookingData.property,
    status: { $in: ['confirmed', 'active'] },
    $or: [
      {
        checkIn: { $lte: bookingData.checkOut },
        checkOut: { $gte: bookingData.checkIn }
      }
    ]
  });
  
  if (conflictingBooking) {
    throw new Error('Property already booked for selected dates');
  }
  
  // Calculate total price
  const days = Math.ceil(
    (new Date(bookingData.checkOut) - new Date(bookingData.checkIn)) 
    / (1000 * 60 * 60 * 24)
  );
  const totalPrice = property.price * days;
  
  // Create booking
  const booking = await Booking.create({
    ...bookingData,
    totalPrice
  });
  
  return booking.populate('property renter');
};
```

#### 4. ROUTES Layer (API Endpoints)

**Purpose**: Define API endpoints and map to controllers

**Example: auth.routes.js**
```javascript
const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { protect } = require('../../middlewares/auth.middleware');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOTP);
router.get('/profile', protect, authController.getProfile);
router.put('/profile', protect, authController.updateProfile);

module.exports = router;
```

**Example: property.routes.js**
```javascript
const express = require('express');
const router = express.Router();
const propertyController = require('./property.controller');
const { protect, restrictTo } = require('../../middlewares/auth.middleware');

router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getPropertyById);

router.use(protect); // Protect all routes below

router.post('/', restrictTo('owner'), propertyController.createProperty);
router.put('/:id', restrictTo('owner'), propertyController.updateProperty);
router.delete('/:id', restrictTo('owner'), propertyController.deleteProperty);

module.exports = router;
```

### Middleware Layer

#### auth.middleware.js
```javascript
const jwt = require('jsonwebtoken');
const User = require('../modules/auth/auth.model');

exports.protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Not authorized'
    });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission'
      });
    }
    next();
  };
};
```

#### error.middleware.js
```javascript
exports.errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

---

## 🔄 Request Flow

### Example: User Login Flow

```
1. USER ACTION
   └─> User enters credentials and clicks "Login"

2. FRONTEND (View)
   └─> Login.jsx
       ├─> Validates input
       ├─> Calls useAuthStore.login()
       └─> useAuthStore.login()
           └─> Calls api.login() from services/api.js

3. API SERVICE
   └─> api.js
       └─> POST /api/auth/login with credentials

4. BACKEND (Controller)
   └─> auth.routes.js
       └─> Routes to auth.controller.login()
           └─> auth.controller.js
               ├─> Validates request
               ├─> Calls authService.authenticateUser()
               └─> Returns response

5. SERVICE (Business Logic)
   └─> auth.service.js
       ├─> Finds user in database
       ├─> Verifies password
       ├─> Generates JWT token
       └─> Returns user data + token

6. MODEL (Data)
   └─> auth.model.js (User schema)
       └─> MongoDB query via Mongoose

7. RESPONSE FLOW
   └─> Service → Controller → API → Frontend
       └─> useAuthStore updates state
           └─> Login.jsx redirects to dashboard
               └─> UI updates with user data
```

### Example: Create Property Flow

```
1. Owner fills property form → AddProperty.jsx
2. Form submission → api.createProperty()
3. POST /api/properties → property.routes.js
4. Auth middleware verifies JWT → auth.middleware.js
5. Role check (owner only) → restrictTo('owner')
6. property.controller.createProperty()
7. propertyService.createProperty()
8. Property.create() → MongoDB
9. Response → Frontend
10. Redirect to OwnerHome with success message
```

---

## 📊 Database Schema Relationships

```
User (1) ──────< (Many) Property
  │                       │
  │                       │
  │                       │
  └──────< (Many) Booking >──────┘
                  │
                  │
                  └──────< (1) Payment
```

### Relationships

- **User → Property**: One-to-Many (Owner can have multiple properties)
- **User → Booking**: One-to-Many (Renter can have multiple bookings)
- **Property → Booking**: One-to-Many (Property can have multiple bookings)
- **Booking → Payment**: One-to-One (Each booking has one payment)

---

## 🔐 Security Architecture

### Authentication Flow
```
1. User signup/login
2. Server generates JWT token
3. Token stored in localStorage (frontend)
4. Token sent in Authorization header for protected routes
5. Middleware verifies token
6. Request proceeds if valid
```

### Authorization Levels
- **Public**: Anyone can access
- **Authenticated**: Logged-in users only
- **Role-Based**: Specific roles (renter/owner/admin)

---

## 🚀 Deployment Architecture

```
┌─────────────────┐
│   Vercel/       │  ← Frontend (React)
│   Netlify       │
└────────┬────────┘
         │ HTTPS
         ↓
┌─────────────────┐
│   Heroku/       │  ← Backend (Node.js)
│   Railway       │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   MongoDB       │  ← Database
│   Atlas         │
└─────────────────┘
```

---

## 📝 Best Practices Followed

1. **Separation of Concerns**: Clear separation between layers
2. **DRY Principle**: Reusable components and services
3. **Error Handling**: Centralized error middleware
4. **Validation**: Input validation at multiple levels
5. **Security**: JWT auth, password hashing, CORS
6. **Scalability**: Modular structure for easy expansion
7. **Code Organization**: Feature-based module structure
8. **API Design**: RESTful conventions
9. **State Management**: Centralized with Zustand
10. **Type Safety**: Mongoose schemas for data validation

---

**This MVC architecture ensures maintainability, scalability, and clean code organization throughout the HomeHive application.**
