import cron from 'node-cron';
import BookingModel from '../models/bookingModel.js';
import PackageModel from '../models/packageModel.js';
import { sendEmail } from '../utils/sendEmail.js';

export const startCancelExpiredBookingsJob = () => {

  // Testing purposes
  // cron.schedule('*/10 * * * * *', async () => { // every 10 seconds

  cron.schedule('*/30 * * * *', async () => {  // every 30 mins
    const now = new Date();
    const expiredBookings = await BookingModel.find({
      paymentMethod: 'cash',
      bookingStatus: 'pending',
      expiresAt: { $lte: now }
    });

    for (const booking of expiredBookings) {
      booking.bookingStatus = 'cancelled';
      booking.paymentStatus = 'pending';
      await booking.save();

      // Release seats if package
      if (booking.bookingType === 'Package') {
        const item = await PackageModel.findById(booking.item);
        if (item) {
          const seatsToRelease =
            (booking.people.adults || 0) +
            (booking.people.children || 0) +
            (booking.people.foreigners || 0);
          item.availableSeats += seatsToRelease;
          await item.save();
        }
      }

      // Notify user
      await sendEmail({
        email: booking.user.email,
        subject: 'Booking Expired - Safarny',
        html: bookingExpiredEmail({ user: booking.user, booking })
      });

    }
  });
};


export const bookingExpiredEmail = ({ user, booking }) => {
  const { bookingNumber, bookingType, item, expiresAt, people } = booking;

  return `
  <div style="font-family:Arial,sans-serif; background:#f8f9fa; padding:20px;">
    <div style="max-width:600px; margin:auto; background:white; padding:20px; border-radius:8px; border:1px solid #ddd;">
      <h2 style="color:#dc3545;">Booking Expired</h2>
      <p>Hi <strong>${user.firstName}</strong>,</p>
      <p>Your booking for <strong>${item.title}</strong> (${bookingType}) has expired because the cash payment was not received within 48 hours.</p>
      <table style="width:100%; border-collapse:collapse; margin:20px 0;">
        <tr><td><strong>Booking Number:</strong></td><td>${bookingNumber}</td></tr>
        <tr><td><strong>Booking Expired At:</strong></td><td>${new Date(expiresAt).toLocaleString()}</td></tr>
        <tr><td><strong>People:</strong></td><td>
          ${people.adults ? `Adults: ${people.adults} <br>` : ''}
          ${people.children ? `Children: ${people.children} <br>` : ''}
          ${people.foreigners ? `Foreigners: ${people.foreigners} <br>` : ''}
        </td></tr>
      </table>
      <p>If you still wish to book, please create a new booking.</p>
      <p style="color:#888; font-size:12px;">For assistance, contact support@safarny.com</p>
    </div>
  </div>
  `;
};
