export const PHONE = '+919876543210';
export const PHONE_DISPLAY = '+91 98765 43210';
export const EMAIL = 'hello@holidayalonghotels.com';

export const waLink = (text = "Hi! I'd like help planning a hotel stay.") =>
  `https://wa.me/${PHONE.replace('+', '')}?text=${encodeURIComponent(text)}`;

export const waHotel = (hotel) =>
  waLink(`Hi! I'm interested in ${hotel?.name || 'a hotel'}${hotel?.city ? `, ${hotel.city}` : ''}. Please share availability and tariffs.`);
