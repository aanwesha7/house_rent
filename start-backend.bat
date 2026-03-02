@echo off
cd server
echo Starting HomeHive Backend...
echo Ensure you have updated .env with your Razorpay keys and MongoDB URI.
echo If MongoDB is not running, bookings will NOT be saved but payment demo will work.
node index.js
pause
