# Architecture Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                               │
│                    (Postman/Frontend)                        │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP Requests
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      SERVER (Port 5000)                      │
│                       server.js                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  • Load environment variables (.env)                   │ │
│  │  • Connect to MongoDB                                  │ │
│  │  • Start Express server                                │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXPRESS APP (app.js)                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Middleware Stack:                                     │ │
│  │  1. CORS                                               │ │
│  │  2. JSON Parser                                        │ │
│  │  3. URL Encoded Parser                                 │ │
│  │  4. Routes (/api)                                      │ │
│  │  5. Error Handler                                      │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   ROUTES (routes/index.js)                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  /api/auth → Auth Routes                              │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              AUTH ROUTES (auth/auth.routes.js)               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  POST   /signup          → signup controller          │ │
│  │  POST   /login           → login controller           │ │
│  │  POST   /forgot-password → forgotPassword controller  │ │
│  │  POST   /verify-otp      → verifyOTP controller       │ │
│  │  POST   /reset-password  → resetPassword controller   │ │
│  │  GET    /profile         → getProfile (protected)     │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           CONTROLLERS (auth/auth.controller.js)              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  • Validate request data                               │ │
│  │  • Call service layer                                  │ │
│  │  • Send response                                       │ │
│  │  • Handle errors                                       │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│             SERVICES (auth/auth.service.js)                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Business Logic:                                       │ │
│  │  • Verify Turnstile token                             │ │
│  │  • Check user existence                               │ │
│  │  • Create/update users                                │ │
│  │  • Generate OTP                                        │ │
│  │  • Send emails                                         │ │
│  │  • Generate JWT tokens                                 │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────┬──────────────────────────────────┬───────────────┘
           │                                  │
           ▼                                  ▼
┌──────────────────────────┐    ┌───────────────────────────┐
│   MODEL (auth.model.js)  │    │  UTILITIES & CONFIG       │
│  ┌────────────────────┐  │    │  ┌─────────────────────┐  │
│  │  User Schema:      │  │    │  │ • generateToken.js  │  │
│  │  • name            │  │    │  │ • generateOTP.js    │  │
│  │  • mobile          │  │    │  │ • mail.js           │  │
│  │  • email           │  │    │  │ • database.js       │  │
│  │  • password        │  │    │  └─────────────────────┘  │
│  │  • otp             │  │    └───────────────────────────┘
│  │  • otpExpiry       │  │
│  │                    │  │
│  │  Methods:          │  │
│  │  • matchPassword() │  │
│  │                    │  │
│  │  Hooks:            │  │
│  │  • pre-save hash   │  │
│  └────────────────────┘  │
└──────────┬───────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│                    MONGODB DATABASE                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Collection: users                                     │ │
│  │  • _id, name, mobile, email, password (hashed)        │ │
│  │  • otp, otpExpiry, createdAt, updatedAt               │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Request Flow Examples

### 1. Signup Flow

```
Client
  │
  │ POST /api/auth/signup
  │ { name, mobile, email, password, turnstileToken }
  ▼
server.js → app.js → routes/index.js → auth.routes.js
  │
  ▼
auth.controller.signup()
  │
  ├─→ Validate input (auth.validation.js)
  │
  ▼
auth.service.signup()
  │
  ├─→ Verify Turnstile (axios → Cloudflare API)
  ├─→ Check if user exists (User.findOne)
  ├─→ Create user (User.create)
  │   └─→ Pre-save hook hashes password (bcrypt)
  ├─→ Send welcome email (mail.js → Gmail SMTP)
  └─→ Generate JWT token (generateToken.js)
  │
  ▼
Response: { user, token }
```

### 2. Login Flow

```
Client
  │
  │ POST /api/auth/login
  │ { email, password }
  ▼
auth.controller.login()
  │
  ├─→ Validate input
  │
  ▼
auth.service.login()
  │
  ├─→ Find user by email (User.findOne)
  ├─→ Compare password (user.matchPassword → bcrypt.compare)
  └─→ Generate JWT token
  │
  ▼
Response: { user, token }
```

### 3. Protected Route Flow

```
Client
  │
  │ GET /api/auth/profile
  │ Headers: { Authorization: Bearer <token> }
  ▼
auth.middleware.protect()
  │
  ├─→ Extract token from header
  ├─→ Verify token (jwt.verify)
  ├─→ Find user by ID (User.findById)
  └─→ Attach user to req.user
  │
  ▼
auth.controller.getProfile()
  │
  └─→ Return user data from req.user
  │
  ▼
Response: { message, user }
```

### 4. Password Reset Flow

```
Client
  │
  │ POST /api/auth/forgot-password
  │ { email }
  ▼
auth.service.forgotPassword()
  │
  ├─→ Find user (User.findOne)
  ├─→ Generate OTP (generateOTP.js)
  ├─→ Set OTP expiry (10 minutes)
  ├─→ Save to database
  └─→ Send OTP email (mail.js)
  │
  ▼
Response: { message: "OTP sent" }

─────────────────────────────────

Client
  │
  │ POST /api/auth/verify-otp
  │ { email, otp }
  ▼
auth.service.verifyOTP()
  │
  ├─→ Find user
  ├─→ Check OTP matches
  └─→ Check OTP not expired
  │
  ▼
Response: { message: "OTP verified" }

─────────────────────────────────

Client
  │
  │ POST /api/auth/reset-password
  │ { email, otp, newPassword }
  ▼
auth.service.resetPassword()
  │
  ├─→ Find user
  ├─→ Verify OTP
  ├─→ Update password
  │   └─→ Pre-save hook hashes new password
  └─→ Clear OTP fields
  │
  ▼
Response: { message: "Password reset" }
```

## 🔐 Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                         │
├─────────────────────────────────────────────────────────────┤
│  1. Cloudflare Turnstile                                    │
│     └─→ Bot protection on signup                            │
│                                                              │
│  2. Input Validation                                         │
│     └─→ Email format, password length, mobile format        │
│                                                              │
│  3. Password Hashing                                         │
│     └─→ bcrypt with 10 salt rounds                          │
│                                                              │
│  4. JWT Authentication                                       │
│     └─→ Token-based auth with 7-day expiration              │
│                                                              │
│  5. OTP Expiration                                           │
│     └─→ 10-minute validity for password reset               │
│                                                              │
│  6. Protected Routes                                         │
│     └─→ Middleware verifies JWT before access               │
│                                                              │
│  7. Environment Variables                                    │
│     └─→ Sensitive data in .env (not in code)                │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Dependencies Map

```
server.js
  ├─→ dotenv (load .env)
  ├─→ app.js
  └─→ config/database.js
       └─→ mongoose

app.js
  ├─→ express
  ├─→ cors
  ├─→ routes/index.js
  └─→ middlewares/error.middleware.js

auth.service.js
  ├─→ auth.model.js
  │    ├─→ mongoose
  │    └─→ bcryptjs
  ├─→ generateToken.js
  │    └─→ jsonwebtoken
  ├─→ generateOTP.js
  ├─→ config/mail.js
  │    └─→ nodemailer
  └─→ axios (for Turnstile)

auth.middleware.js
  ├─→ jsonwebtoken
  └─→ auth.model.js
```

## 🗄️ Database Schema

```
┌─────────────────────────────────────────────────────────────┐
│                      users Collection                        │
├─────────────────────────────────────────────────────────────┤
│  _id          : ObjectId (auto-generated)                   │
│  name         : String (required, trimmed)                  │
│  mobile       : String (required, unique, 10 digits)        │
│  email        : String (required, unique, lowercase)        │
│  password     : String (required, hashed, min 6 chars)      │
│  otp          : String (optional, 6 digits)                 │
│  otpExpiry    : Date (optional, 10 min from generation)     │
│  createdAt    : Date (auto-generated)                       │
│  updatedAt    : Date (auto-updated)                         │
└─────────────────────────────────────────────────────────────┘

Indexes:
  • email (unique)
  • mobile (unique)
```

## 🌐 API Endpoints Summary

```
┌──────────┬─────────────────────────┬──────────┬─────────────┐
│  Method  │       Endpoint          │   Auth   │  Function   │
├──────────┼─────────────────────────┼──────────┼─────────────┤
│  POST    │ /api/auth/signup        │    No    │  Register   │
│  POST    │ /api/auth/login         │    No    │  Login      │
│  POST    │ /api/auth/forgot-pass   │    No    │  Send OTP   │
│  POST    │ /api/auth/verify-otp    │    No    │  Check OTP  │
│  POST    │ /api/auth/reset-pass    │    No    │  Reset Pass │
│  GET     │ /api/auth/profile       │   Yes    │  Get User   │
└──────────┴─────────────────────────┴──────────┴─────────────┘
```

## ✅ Code Connection Verification

All components are properly connected:

✅ **server.js** → Loads .env, connects DB, starts app  
✅ **app.js** → Sets up middleware, routes, error handler  
✅ **routes/index.js** → Mounts auth routes at /api/auth  
✅ **auth.routes.js** → Defines 6 endpoints, uses protect middleware  
✅ **auth.controller.js** → Validates input, calls services  
✅ **auth.service.js** → Business logic, DB operations  
✅ **auth.model.js** → User schema, password hashing  
✅ **auth.middleware.js** → JWT verification for protected routes  
✅ **config/database.js** → MongoDB connection  
✅ **config/mail.js** → Email sending via Gmail  
✅ **utils/generateToken.js** → JWT creation  
✅ **utils/generateOTP.js** → 6-digit OTP generation  

## 🎯 Environment Variables Used

```
PORT                  → Server port (5000)
MONGODB_URI           → Database connection
JWT_SECRET            → Token signing key
EMAIL_USER            → Gmail address
EMAIL_PASS            → Gmail app password
TURNSTILE_SECRET_KEY  → Cloudflare verification
NODE_ENV              → Environment mode
```

All environment variables are properly referenced in the code!
