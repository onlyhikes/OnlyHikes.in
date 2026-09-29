// ====================================================================
// ONLYHIKES.IN — SERVER-SIDE SEAT VALIDATOR
// Prevents overbooking and guarantees seat inventory integrity
// ====================================================================

function validateSeatAvailability(hike, requestedSeats) {
  if (!hike) {
    return {
      available: false,
      message: 'Hike not found.'
    };
  }

  const seatsNum = parseInt(requestedSeats, 10);
  if (isNaN(seatsNum) || seatsNum <= 0) {
    return {
      available: false,
      message: 'Please select at least 1 seat.'
    };
  }

  if (seatsNum > 10) {
    return {
      available: false,
      message: 'Maximum 10 seats allowed per booking. For larger group bookings, contact coordinators.'
    };
  }

  const totalSeats = parseInt(hike.total_seats, 10);
  const bookedSeats = parseInt(hike.booked_seats || 0, 10);
  const remaining = totalSeats - bookedSeats;

  if (remaining <= 0) {
    return {
      available: false,
      remaining: 0,
      message: 'Sold out! All seats for this hike have been booked.'
    };
  }

  if (seatsNum > remaining) {
    return {
      available: false,
      remaining,
      message: `Only ${remaining} ${remaining === 1 ? 'seat' : 'seats'} remaining. Please reduce your seat count.`
    };
  }

  return {
    available: true,
    requestedSeats: seatsNum,
    remainingSeatsAfter: remaining - seatsNum,
    remainingCurrent: remaining
  };
}

module.exports = {
  validateSeatAvailability
};
