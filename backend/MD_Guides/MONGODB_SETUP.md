# MongoDB Setup Guide

## ⚠️ Current Issue

The MongoDB connection is failing with "bad auth: authentication failed". This means either:
1. The password is incorrect
2. The username is incorrect
3. The database user doesn't have proper permissions

## 🔧 How to Fix

### Option 1: Update MongoDB Atlas Credentials

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Log in to your account
3. Select your cluster (RentAPP)
4. Click "Database Access" in the left sidebar
5. Find user "nikkityagi81" or create a new user
6. Click "Edit" and reset the password
7. Copy the new password
8. Update `.env` file:

```env
# If password has special characters, URL encode them:
# @ becomes %40
# ! becomes %21
# # becomes %23
# $ becomes %24
# % becomes %25
# ^ becomes %5E
# & becomes %26
# * becomes %2A

MONGODB_URI=mongodb+srv://username:password@rentapp.m8km26p.mongodb.net/?appName=RentAPP
```

### Option 2: Use Local MongoDB (Recommended for Testing)

1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   mongod
   ```

3. Update `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/house-rent
   ```

### Option 3: Create New MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Create a database user:
   - Username: your_username
   - Password: your_password (no special characters for simplicity)
5. Whitelist your IP or use 0.0.0.0/0 for testing
6. Get connection string and update `.env`

## 📝 Current Configuration

Your current `.env` has:
```
MONGODB_URI=mongodb+srv://nikkityagi81:Meerut%40123.@rentapp.m8km26p.mongodb.net/?appName=RentAPP
```

The password "Meerut@123." has been URL encoded to "Meerut%40123." but authentication is still failing.

## ✅ Testing MongoDB Connection

After updating credentials, test the connection:

```bash
cd backend
node server.js
```

You should see:
```
Server running on port 5000
MongoDB connected successfully
```

## 🔍 Troubleshooting

### Error: "bad auth: authentication failed"
- Check username and password are correct
- Ensure user has read/write permissions
- Try resetting the password in MongoDB Atlas

### Error: "IP not whitelisted"
- Go to Network Access in MongoDB Atlas
- Add your IP address or use 0.0.0.0/0 for testing

### Error: "querySrv ENOTFOUND"
- Check internet connection
- Verify the cluster hostname is correct
- Try using the standard connection string instead of SRV

## 🎯 Quick Fix for Testing

For immediate testing, use a local MongoDB instance:

1. Install MongoDB:
   - Windows: Download from mongodb.com
   - Mac: `brew install mongodb-community`
   - Linux: `sudo apt-get install mongodb`

2. Start MongoDB:
   ```bash
   mongod
   ```

3. Update `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/house-rent
   ```

4. Restart server:
   ```bash
   npm run dev
   ```

This will work immediately without any authentication issues!
