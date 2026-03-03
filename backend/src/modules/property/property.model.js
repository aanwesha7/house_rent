const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Property description is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    bhk: {
      type: String,
      required: [true, 'BHK is required'],
    },
    type: {
      type: String,
      enum: ['Apartment', 'Villa', 'House', 'Studio', 'Penthouse'],
      default: 'Apartment',
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&fit=crop',
    },
    images: [{
      type: String,
    }],
    amenities: [{
      type: String,
    }],
    coordinates: {
      lat: {
        type: Number,
        default: 28.7041,
      },
      lng: {
        type: Number,
        default: 77.1025,
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'rented', 'maintenance'],
      default: 'available',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search optimization
propertySchema.index({ city: 1, price: 1, bhk: 1 });
propertySchema.index({ owner: 1 });

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
