const bookingService = require('./booking.service');

class BookingController {
  // Create new booking
  async createBooking(req, res, next) {
    try {
      const booking = await bookingService.createBooking(req.body, req.user._id);

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get user's bookings
  async getMyBookings(req, res, next) {
    try {
      const bookings = await bookingService.getUserBookings(req.user._id);

      res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single booking
  async getBookingById(req, res, next) {
    try {
      const booking = await bookingService.getBookingById(req.params.id, req.user._id);

      res.status(200).json({
        success: true,
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }

  // Cancel booking
  async cancelBooking(req, res, next) {
    try {
      const booking = await bookingService.cancelBooking(req.params.id, req.user._id);

      res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get owner's bookings
  async getOwnerBookings(req, res, next) {
    try {
      const bookings = await bookingService.getOwnerBookings(req.user._id);

      res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update booking status (owner/admin)
  async updateBookingStatus(req, res, next) {
    try {
      const { status } = req.body;
      const booking = await bookingService.updateBookingStatus(
        req.params.id,
        status,
        req.user._id,
        req.user.role
      );

      res.status(200).json({
        success: true,
        message: 'Booking status updated successfully',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all bookings (admin only)
  async getAllBookings(req, res, next) {
    try {
      const bookings = await bookingService.getAllBookings();

      res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookingController();
