const Booking = require('./booking.model');
const Property = require('../property/property.model');

class BookingService {
  // Create new booking
  async createBooking(bookingData, renterId) {
    const { propertyId, checkIn, checkOut, guests, totalPrice, notes } = bookingData;

    // Verify property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      throw new Error('Property not found');
    }

    // Check if property is available
    if (property.status !== 'available') {
      throw new Error('Property is not available for booking');
    }

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      throw new Error('Check-in date cannot be in the past');
    }

    if (checkOutDate <= checkInDate) {
      throw new Error('Check-out date must be after check-in date');
    }

    // Check for overlapping bookings
    const overlappingBooking = await Booking.findOne({
      property: propertyId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { checkIn: { $lte: checkOutDate }, checkOut: { $gte: checkInDate } },
      ],
    });

    if (overlappingBooking) {
      throw new Error('Property is already booked for selected dates');
    }

    // Create booking
    const booking = await Booking.create({
      property: propertyId,
      renter: renterId,
      owner: property.owner,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice,
      notes,
    });

    return await booking.populate([
      { path: 'property', select: 'title city price image' },
      { path: 'renter', select: 'name email mobile' },
      { path: 'owner', select: 'name email mobile' },
    ]);
  }

  // Get user's bookings
  async getUserBookings(userId) {
    const bookings = await Booking.find({ renter: userId })
      .populate('property', 'title city price image address')
      .populate('owner', 'name email mobile')
      .sort({ createdAt: -1 })
      .lean();

    return bookings;
  }

  // Get single booking
  async getBookingById(bookingId, userId) {
    const booking = await Booking.findById(bookingId)
      .populate('property')
      .populate('renter', 'name email mobile')
      .populate('owner', 'name email mobile')
      .lean();

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Check if user is authorized to view this booking
    if (
      booking.renter._id.toString() !== userId.toString() &&
      booking.owner._id.toString() !== userId.toString()
    ) {
      throw new Error('Not authorized to view this booking');
    }

    return booking;
  }

  // Cancel booking
  async cancelBooking(bookingId, userId) {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Only renter can cancel their own booking
    if (booking.renter.toString() !== userId.toString()) {
      throw new Error('Not authorized to cancel this booking');
    }

    // Can only cancel pending or confirmed bookings
    if (!['pending', 'confirmed'].includes(booking.status)) {
      throw new Error('Cannot cancel this booking');
    }

    booking.status = 'cancelled';
    await booking.save();

    return booking;
  }

  // Get owner's bookings
  async getOwnerBookings(ownerId) {
    const bookings = await Booking.find({ owner: ownerId })
      .populate('property', 'title city price image')
      .populate('renter', 'name email mobile')
      .sort({ createdAt: -1 })
      .lean();

    return bookings;
  }

  // Update booking status (owner/admin)
  async updateBookingStatus(bookingId, status, userId, userRole) {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Check authorization
    if (userRole !== 'admin' && booking.owner.toString() !== userId.toString()) {
      throw new Error('Not authorized to update this booking');
    }

    // Validate status transition
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid booking status');
    }

    booking.status = status;
    await booking.save();

    return booking;
  }

  // Get all bookings (admin only)
  async getAllBookings() {
    const bookings = await Booking.find()
      .populate('property', 'title city price')
      .populate('renter', 'name email')
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return bookings;
  }
}

module.exports = new BookingService();
