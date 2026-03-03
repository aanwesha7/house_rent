const express = require('express');
const router = express.Router();
const propertyController = require('./property.controller');
const { protect, restrictTo } = require('../../middlewares/auth.middleware');

// Public routes
router.get('/', propertyController.getAllProperties);
router.get('/search', propertyController.searchProperties);
router.get('/:id', propertyController.getPropertyById);

// Protected routes (owner only)
router.use(protect); // All routes below require authentication

router.post('/', restrictTo('owner', 'admin'), propertyController.createProperty);
router.get('/owner/my-properties', restrictTo('owner', 'admin'), propertyController.getOwnerProperties);
router.put('/:id', restrictTo('owner', 'admin'), propertyController.updateProperty);
router.delete('/:id', restrictTo('owner', 'admin'), propertyController.deleteProperty);

module.exports = router;
