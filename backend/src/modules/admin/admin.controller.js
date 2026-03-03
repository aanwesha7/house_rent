const User = require('../auth/auth.model');
const Property = require('../property/property.model');
const Booking = require('../booking/booking.model');

class AdminController {
  // Get dashboard statistics
  async getDashboardStats(req, res, next) {
    try {
      const [
        totalUsers,
        totalProperties,
        totalBookings,
        totalRevenue,
        usersByRole,
        recentBookings,
        propertiesByCity,
      ] = await Promise.all([
        User.countDocuments(),
        Property.countDocuments(),
        Booking.countDocuments(),
        Booking.aggregate([
          { $match: { paymentStatus: 'paid' } },
          { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ]),
        User.aggregate([
          { $group: { _id: '$role', count: { $sum: 1 } } },
        ]),
        Booking.find()
          .populate('property', 'title city')
          .populate('renter', 'name email')
          .sort({ createdAt: -1 })
          .limit(10)
          .lean(),
        Property.aggregate([
          { $group: { _id: '$city', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ]),
      ]);

      const revenue = totalRevenue[0]?.total || 0;

      res.status(200).json({
        success: true,
        data: {
          overview: {
            totalUsers,
            totalProperties,
            totalBookings,
            totalRevenue: revenue,
          },
          usersByRole: usersByRole.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
          recentBookings,
          propertiesByCity,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all users
  async getAllUsers(req, res, next) {
    try {
      const { role, search, page = 1, limit = 20 } = req.query;

      const query = {};
      if (role) query.role = role;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      const users = await User.find(query)
        .select('-password -otp -otpExpiry')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean();

      const count = await User.countDocuments(query);

      res.status(200).json({
        success: true,
        count: users.length,
        total: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get user by ID
  async getUserById(req, res, next) {
    try {
      const user = await User.findById(req.params.id)
        .select('-password -otp -otpExpiry')
        .lean();

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // Get user's properties and bookings
      const [properties, bookings] = await Promise.all([
        Property.find({ owner: user._id }).lean(),
        Booking.find({ renter: user._id }).populate('property', 'title city').lean(),
      ]);

      res.status(200).json({
        success: true,
        data: {
          ...user,
          properties,
          bookings,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Update user
  async updateUser(req, res, next) {
    try {
      const { name, email, mobile, role, isEmailVerified } = req.body;

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      if (name) user.name = name;
      if (email) user.email = email;
      if (mobile) user.mobile = mobile;
      if (role) user.role = role;
      if (typeof isEmailVerified !== 'undefined') user.isEmailVerified = isEmailVerified;

      await user.save();

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete user
  async deleteUser(req, res, next) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // Delete user's properties and bookings
      await Promise.all([
        Property.deleteMany({ owner: user._id }),
        Booking.deleteMany({ renter: user._id }),
      ]);

      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all properties (admin view)
  async getAllProperties(req, res, next) {
    try {
      const { status, city, page = 1, limit = 20 } = req.query;

      const query = {};
      if (status) query.status = status;
      if (city) query.city = { $regex: city, $options: 'i' };

      const properties = await Property.find(query)
        .populate('owner', 'name email mobile')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean();

      const count = await Property.countDocuments(query);

      res.status(200).json({
        success: true,
        count: properties.length,
        total: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        data: properties,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete property (admin)
  async deleteProperty(req, res, next) {
    try {
      const property = await Property.findByIdAndDelete(req.params.id);

      if (!property) {
        return res.status(404).json({
          success: false,
          message: 'Property not found',
        });
      }

      // Delete related bookings
      await Booking.deleteMany({ property: property._id });

      res.status(200).json({
        success: true,
        message: 'Property deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all bookings (admin view)
  async getAllBookings(req, res, next) {
    try {
      const { status, page = 1, limit = 20 } = req.query;

      const query = {};
      if (status) query.status = status;

      const bookings = await Booking.find(query)
        .populate('property', 'title city price')
        .populate('renter', 'name email mobile')
        .populate('owner', 'name email')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean();

      const count = await Booking.countDocuments(query);

      res.status(200).json({
        success: true,
        count: bookings.length,
        total: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        data: bookings,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();
