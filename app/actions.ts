import 'leaflet/dist/leaflet.css';

export type BookingState = {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
};

export async function submitBooking(
  _prevState: BookingState,
  formData: FormData,
): Promise<BookingState> {
  const service = String(formData.get('service') || '').trim();
  const date = String(formData.get('date') || '').trim();
  const time = String(formData.get('time') || '').trim();

  const errors: Record<string, string> = {};
  if (!service) errors.service = 'Please select a service.';
  if (!date) errors.date = 'Please choose a date.';
  if (!time) errors.time = 'Please choose a time.';

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: 'Please fix the highlighted fields.',
      errors,
    };
  }

  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    success: true,
    message: 'Booking confirmed! A cleaner will contact you shortly.',
  };
}
