const propertyService = require('./property.service');

class PropertyController {
  // Get all properties
  async getAllProperties(req, res, next) {
    try {
      const filters = {
        city: req.query.city,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        bhk: req.query.bhk,
        type: req.query.type,
        sortBy: req.query.sortBy,
        status: req.query.status,
      };

      const properties = await propertyService.getAllProperties(filters);

      res.status(200).json({
        success: true,
        count: properties.length,
        data: properties,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single property
  async getPropertyById(req, res, next) {
    try {
      const property = await propertyService.getPropertyById(req.params.id);

      res.status(200).json({
        success: true,
        data: property,
      });
    } catch (error) {
      next(error);
    }
  }

  // Create property (owner only)
  async createProperty(req, res, next) {
    try {
      const property = await propertyService.createProperty(req.body, req.user._id);

      res.status(201).json({
        success: true,
        message: 'Property created successfully',
        data: property,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update property (owner only)
  async updateProperty(req, res, next) {
    try {
      const property = await propertyService.updateProperty(
        req.params.id,
        req.body,
        req.user._id
      );

      res.status(200).json({
        success: true,
        message: 'Property updated successfully',
        data: property,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete property (owner only)
  async deleteProperty(req, res, next) {
    try {
      const result = await propertyService.deleteProperty(req.params.id, req.user._id);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get owner's properties
  async getOwnerProperties(req, res, next) {
    try {
      const properties = await propertyService.getOwnerProperties(req.user._id);

      res.status(200).json({
        success: true,
        count: properties.length,
        data: properties,
      });
    } catch (error) {
      next(error);
    }
  }

  // Search properties
  async searchProperties(req, res, next) {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required',
        });
      }

      const properties = await propertyService.searchProperties(q);

      res.status(200).json({
        success: true,
        count: properties.length,
        data: properties,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PropertyController();
