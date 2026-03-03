const express = require('express');
const router = express.Router();
const savedPropertyController = require('./savedProperty.controller');
const { protect } = require('../../middlewares/auth.middleware');

router.use(protect);

router.get('/', savedPropertyController.getSavedProperties);
router.post('/', savedPropertyController.saveProperty);
router.delete('/:propertyId', savedPropertyController.unsaveProperty);

module.exports = router;
