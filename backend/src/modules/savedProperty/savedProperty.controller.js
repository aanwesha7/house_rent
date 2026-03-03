const SavedProperty = require('./savedProperty.model');
const Property = require('../property/property.model');

class SavedPropertyController {
  // Get user's saved properties
  async getSavedProperties(req, res, next) {
    try {
      const savedProperties = await SavedProperty.find({ user: req.user._id })
        .populate('property')
        .sort({ createdAt: -1 })
        .lean();

      const properties = savedProperties.map(sp => sp.property).filter(p => p !== null);

      res.status(200).json({
        success: true,
        count: properties.length,
        data: properties,
      });
    } catch (error) {
      next(error);
    }
  }

  // Save a property
  async saveProperty(req, res, next) {
    try {
      const { propertyId } = req.body;

      // Check if property exists
      const property = await Property.findById(propertyId);
      if (!property) {
        return res.status(404).json({
          success: false,
          message: 'Property not found',
        });
      }

      // Check if already saved
      const existing = await SavedProperty.findOne({
        user: req.user._id,
        property: propertyId,
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Property already saved',
        });
      }

      // Save property
      await SavedProperty.create({
        user: req.user._id,
        property: propertyId,
      });

      res.status(201).json({
        success: true,
        message: 'Property saved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // Unsave a property
  async unsaveProperty(req, res, next) {
    try {
      const { propertyId } = req.params;

      const result = await SavedProperty.findOneAndDelete({
        user: req.user._id,
        property: propertyId,
      });

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Saved property not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Property unsaved successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SavedPropertyController();
