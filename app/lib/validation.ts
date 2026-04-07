import { z } from 'zod';

export const BOOKING_SERVICES = [
  'End of Lease Cleaning',
  'Standard Home Cleaning',
  'Carpet Steam Cleaning',
  'Office Deep Clean',
  'Mould Remediation',
  'Hazardous Bio Clean',
] as const;

export const bookingSchema = z.object({
  service: z.enum(BOOKING_SERVICES, {
    errorMap: () => ({ message: 'Please select a valid service.' }),
  }),
  date: z
    .string()
    .min(1, 'Please choose a date.')
    .refine((val) => {
      const date = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    }, 'Date cannot be in the past.'),
  time: z
    .string()
    .min(1, 'Please choose a time.')
    .regex(/^\d{2}:\d{2}$/, 'Invalid time format.')
    .refine((val) => {
      const [hours] = val.split(':').map(Number);
      return hours >= 7 && hours < 21;
    }, 'Business hours are 7 AM – 9 PM.'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name is too long.')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .regex(
      /^(\+?61|0)[2-9]\d{7,9}$/,
      'Enter a valid Australian phone number.',
    )
    .optional()
    .or(z.literal('')),
  notes: z.string().max(500, 'Notes must be under 500 characters.').optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
