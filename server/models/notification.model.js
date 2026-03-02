const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Setting to false for easier demo if no user id
    },
    type: {
        type: String,
        enum: ['booking', 'payment', 'review', 'admin', 'warning', 'info'],
        default: 'info'
    },
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    actionUrl: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
