import { bookingSchema } from './lib/validation';
import type { BookingInput } from './lib/validation';
import { isSupabaseConfigured, supabase } from './lib/supabase';

export type BookingState = {
  success: boolean;
  message: string;
  errors?: Partial<Record<keyof BookingInput, string>>;
};

export async function submitBooking(
  _prevState: BookingState,
  formData: FormData,
): Promise<BookingState> {
  const raw: BookingInput = {
    service: String(formData.get('service') || '') as BookingInput['service'],
    date: String(formData.get('date') || '').trim(),
    time: String(formData.get('time') || '').trim(),
    name: String(formData.get('name') || '').trim(),
    phone: String(formData.get('phone') || '').trim(),
    notes: String(formData.get('notes') || '').trim(),
  };

  const result = bookingSchema.safeParse(raw);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    const errors: BookingState['errors'] = {};
    for (const key of Object.keys(fieldErrors) as (keyof typeof fieldErrors)[]) {
      errors[key as keyof BookingInput] = fieldErrors[key]?.[0] ?? 'Invalid value.';
    }
    return {
      success: false,
      message: 'Please fix the highlighted fields.',
      errors,
    };
  }

  const { service, date, time, name, phone, notes } = result.data;

  await new Promise<void>((resolve) => setTimeout(resolve, 600));

  // Persist to Supabase
  if (isSupabaseConfigured && supabase) {
    const { error: dbError } = await supabase.from('bookings').insert({
      service,
      booking_date: date,
      booking_time: time,
      customer_name: name || null,
      customer_phone: phone || null,
      notes: notes || null,
      status: 'pending',
    });

    if (dbError) {
      console.error('[EmeraldClean DB Error]', dbError);
      return {
        success: false,
        message: 'Something went wrong saving your booking. Please try again.',
      };
    }
  } else {
    // Dev fallback: log booking to console
    console.log('[EmeraldClean Booking]', {
      service,
      date,
      time,
      name: name || undefined,
      phone: phone || undefined,
      notes: notes || undefined,
      createdAt: new Date().toISOString(),
    });
  }

  return {
    success: true,
    message: 'Booking confirmed! A cleaner will contact you shortly.',
  };
}
