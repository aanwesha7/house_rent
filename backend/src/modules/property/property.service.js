const Property = require('./property.model');

class PropertyService {
  // Get all properties with filters
  async getAllProperties(filters = {}) {
    const query = {};

    // City filter
    if (filters.city) {
      query.city = { $regex: filters.city, $options: 'i' };
    }

    // Price range filter
    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
      if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
    }

    // BHK filter
    if (filters.bhk) {
      query.bhk = filters.bhk;
    }

    // Type filter
    if (filters.type) {
      query.type = filters.type;
    }

    // Status filter (default to available)
    query.status = filters.status || 'available';

    // Sorting
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (filters.sortBy === 'price-low') sortOption = { price: 1 };
    if (filters.sortBy === 'price-high') sortOption = { price: -1 };
    if (filters.sortBy === 'rating') sortOption = { rating: -1 };

    const properties = await Property.find(query)
      .populate('owner', 'name email mobile')
      .sort(sortOption)
      .lean();

    return properties;
  }

  // Get single property by ID
  async getPropertyById(propertyId) {
    const property = await Property.findById(propertyId)
      .populate('owner', 'name email mobile profileImage')
      .lean();

    if (!property) {
      throw new Error('Property not found');
    }

    return property;
  }

  // Create new property (owner only)
  async createProperty(propertyData, ownerId) {
    const property = await Property.create({
      ...propertyData,
      owner: ownerId,
    });

    return property;
  }

  // Update property (owner only)
  async updateProperty(propertyId, updateData, ownerId) {
    const property = await Property.findOne({ _id: propertyId, owner: ownerId });

    if (!property) {
      throw new Error('Property not found or unauthorized');
    }

    Object.assign(property, updateData);
    await property.save();

    return property;
  }

  // Delete property (owner only)
  async deleteProperty(propertyId, ownerId) {
    const property = await Property.findOneAndDelete({ _id: propertyId, owner: ownerId });

    if (!property) {
      throw new Error('Property not found or unauthorized');
    }

    return { message: 'Property deleted successfully' };
  }

  // Get properties by owner
  async getOwnerProperties(ownerId) {
    const properties = await Property.find({ owner: ownerId })
      .sort({ createdAt: -1 })
      .lean();

    return properties;
  }

  // Search properties
  async searchProperties(searchTerm) {
    const properties = await Property.find({
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { city: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
      ],
      status: 'available',
    })
      .populate('owner', 'name email')
      .limit(20)
      .lean();

    return properties;
  }
}

module.exports = new PropertyService();
