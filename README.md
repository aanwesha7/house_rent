# House Rent Authentication System

A robust authentication backend system for the House Rent application with JWT-based authentication, OTP password reset, and Cloudflare Turnstile verification.

## Features

- User Signup with Cloudflare Turnstile verification
- Email verification with welcome email
- JWT-based authentication
- OTP-based password reset flow
- Protected routes with middleware
- MongoDB database integration
- Email notifications via Nodemailer

## Tech Stack

- Node.js & Express.js
- MongoDB & Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Nodemailer for email
- Cloudflare Turnstile for bot protection

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Update `backend/.env` with your credentials:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/house-rent
JWT_SECRET=your_secure_jwt_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
TURNSTILE_SECRET_KEY=your_cloudflare_turnstile_secret
NODE_ENV=development
```

### 3. Gmail App Password Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account Settings > Security > 2-Step Verification
3. Scroll to "App passwords" and generate a new password
4. Use this password in `EMAIL_PASS`

### 4. Cloudflare Turnstile Setup

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to Turnstile section
3. Create a new site
4. Copy the Secret Key to `TURNSTILE_SECRET_KEY`

### 5. Start the Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

## API Endpoints

See [API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md) for detailed API documentation.

### Quick Reference

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/profile` - Get user profile (Protected)

## Testing with Postman/Thunder Client

### 1. Signup
```json
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "mobile": "1234567890",
  "email": "john@example.com",
  "password": "password123",
  "turnstileToken": "test_token"
}
```

### 2. Login
```json
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### 3. Access Protected Route
```json
GET http://localhost:5000/api/auth/profile
Authorization: Bearer <your_jwt_token>
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js       # MongoDB connection
│   │   └── mail.js           # Email configuration
│   ├── middlewares/
│   │   ├── auth.middleware.js    # JWT verification
│   │   └── error.middleware.js   # Error handling
│   ├── modules/
│   │   └── auth/
│   │       ├── auth.model.js      # User schema
│   │       ├── auth.service.js    # Business logic
│   │       ├── auth.controller.js # Request handlers
│   │       ├── auth.routes.js     # Route definitions
│   │       └── auth.validation.js # Input validation
│   ├── routes/
│   │   └── index.js          # Main router
│   ├── utils/
│   │   ├── generateToken.js  # JWT generation
│   │   └── generateOTP.js    # OTP generation
│   └── app.js                # Express app setup
├── server.js                 # Server entry point
├── .env                      # Environment variables
└── package.json              # Dependencies

```

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT tokens with 7-day expiration
- OTP expires after 10 minutes
- Cloudflare Turnstile bot protection
- Protected routes with middleware
- Input validation on all endpoints

## Development Notes

- Turnstile verification is skipped when `NODE_ENV=test`
- Email sending errors are logged but don't block signup
- All passwords are hashed before storage
- OTP is cleared after successful password reset

## Next Steps

1. Add refresh token mechanism
2. Implement rate limiting
3. Add email verification on signup
4. Create automated tests with Jest
5. Add logging with Winston
6. Implement account lockout after failed attempts

## License

ISC
