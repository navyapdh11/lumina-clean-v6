'use client';

import { useActionState, useEffect, useId } from 'react';
import { useFormStatus } from 'react-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { submitBooking, type BookingState } from '../actions';
import { BOOKING_SERVICES } from '../lib/validation';

const initialState: BookingState = {
  success: false,
  message: '',
};

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="mt-2 text-sm text-red-500" role="alert">
      {error}
    </p>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full btn-gradient text-white py-4 rounded-2xl font-bold text-lg disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
    >
      {pending ? 'Booking...' : 'Confirm & Book Now'}
    </button>
  );
}

export function BookingFormInner({ onSuccess }: { onSuccess: (message: string) => void }) {
  const [state, formAction] = useActionState(submitBooking, initialState);
  const serviceId = useId();
  const dateId = useId();
  const timeId = useId();
  const nameId = useId();
  const phoneId = useId();
  const notesId = useId();

  useEffect(() => {
    if (state.success) {
      onSuccess(state.message);
    }
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {/* Service */}
      <div>
        <label htmlFor={serviceId} className="block text-sm font-medium mb-2 text-emerald-text">
          Service Type <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <select
          id={serviceId}
          name="service"
          defaultValue="End of Lease Cleaning"
          className="w-full p-4 rounded-2xl border border-emerald-outline bg-emerald-surface text-emerald-text focus:outline-none focus:ring-2 focus:ring-emerald-primary"
          aria-describedby={state.errors?.service ? `${serviceId}-error` : undefined}
          aria-invalid={!!state.errors?.service}
        >
          {BOOKING_SERVICES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <FieldError id={`${serviceId}-error`} error={state.errors?.service} />
      </div>

      {/* Date + Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={dateId} className="block text-sm font-medium mb-2 text-emerald-text">
            Date <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id={dateId}
            name="date"
            type="date"
            className="w-full p-4 rounded-2xl border border-emerald-outline bg-emerald-surface text-emerald-text focus:outline-none focus:ring-2 focus:ring-emerald-primary"
            aria-describedby={state.errors?.date ? `${dateId}-error` : undefined}
            aria-invalid={!!state.errors?.date}
          />
          <FieldError id={`${dateId}-error`} error={state.errors?.date} />
        </div>
        <div>
          <label htmlFor={timeId} className="block text-sm font-medium mb-2 text-emerald-text">
            Time <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <select
            id={timeId}
            name="time"
            className="w-full p-4 rounded-2xl border border-emerald-outline bg-emerald-surface text-emerald-text focus:outline-none focus:ring-2 focus:ring-emerald-primary"
            aria-describedby={state.errors?.time ? `${timeId}-error` : undefined}
            aria-invalid={!!state.errors?.time}
          >
            <option value="">Select a time</option>
            {Array.from({ length: 14 }, (_, i) => {
              const h = 7 + i;
              const hh = String(h).padStart(2, '0');
              return [`${hh}:00`, `${hh}:30`];
            })
              .flat()
              .map((t) => (
                <option key={t}>{t}</option>
              ))}
          </select>
          <FieldError id={`${timeId}-error`} error={state.errors?.time} />
        </div>
      </div>

      {/* Name + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={nameId} className="block text-sm font-medium mb-2 text-emerald-text">
            Your Name
          </label>
          <input
            id={nameId}
            name="name"
            type="text"
            placeholder="Jane Smith"
            autoComplete="name"
            className="w-full p-4 rounded-2xl border border-emerald-outline bg-emerald-surface text-emerald-text focus:outline-none focus:ring-2 focus:ring-emerald-primary"
            aria-describedby={state.errors?.name ? `${nameId}-error` : undefined}
            aria-invalid={!!state.errors?.name}
          />
          <FieldError id={`${nameId}-error`} error={state.errors?.name} />
        </div>
        <div>
          <label htmlFor={phoneId} className="block text-sm font-medium mb-2 text-emerald-text">
            Phone
          </label>
          <input
            id={phoneId}
            name="phone"
            type="tel"
            placeholder="0412 345 678"
            autoComplete="tel"
            className="w-full p-4 rounded-2xl border border-emerald-outline bg-emerald-surface text-emerald-text focus:outline-none focus:ring-2 focus:ring-emerald-primary"
            aria-describedby={state.errors?.phone ? `${phoneId}-error` : undefined}
            aria-invalid={!!state.errors?.phone}
          />
          <FieldError id={`${phoneId}-error`} error={state.errors?.phone} />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor={notesId} className="block text-sm font-medium mb-2 text-emerald-text">
          Additional Notes
        </label>
        <textarea
          id={notesId}
          name="notes"
          rows={3}
          placeholder="Access codes, special instructions, parking info..."
          className="w-full p-4 rounded-2xl border border-emerald-outline bg-emerald-surface text-emerald-text focus:outline-none focus:ring-2 focus:ring-emerald-primary resize-none"
          aria-describedby={state.errors?.notes ? `${notesId}-error` : undefined}
          aria-invalid={!!state.errors?.notes}
        />
        <FieldError id={`${notesId}-error`} error={state.errors?.notes} />
      </div>

      {/* General error */}
      {state.message && !state.success && (
        <p className="text-sm text-red-500" role="alert">
          {state.message}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}

export default function BookingForm({
  onSuccess,
  trigger,
  open,
  onOpenChange,
}: {
  onSuccess: (message: string) => void;
  /** Trigger button — omit to render as standalone form */
  trigger?: React.ReactNode;
  /** Controlled open state (requires onOpenChange) */
  open?: boolean;
  /** Callback when dialog open state changes */
  onOpenChange?: (open: boolean) => void;
}) {
  const [state, formAction] = useActionState(submitBooking, initialState);
  const titleId = useId();

  useEffect(() => {
    if (state.success) {
      onSuccess(state.message);
      onOpenChange?.(false);
    }
  }, [state, onSuccess, onOpenChange]);

  // Uncontrolled: standalone form (no trigger, no open)
  if (trigger === undefined && open === undefined) {
    return <BookingFormInner onSuccess={onSuccess} />;
  }

  // Radix Dialog: controlled or with trigger
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] animate-in fade-in duration-200" />
        <Dialog.Content
          className="fixed z-[10000] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-emerald-surface rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 fade-in duration-200 focus:outline-none max-h-[90vh] overflow-y-auto"
          aria-labelledby={titleId}
        >
          <Dialog.Title id={titleId} className="font-headline text-3xl mb-6 text-emerald-text">
            Book Your Cleaning
          </Dialog.Title>
          <Dialog.Close asChild>
            <button
              aria-label="Close booking dialog"
              className="absolute top-5 right-5 rounded-full p-2 hover:bg-emerald-surfaceLow transition-colors"
              type="button"
            >
              <X className="h-5 w-5 text-emerald-textMuted" />
            </button>
          </Dialog.Close>
          <BookingFormInner onSuccess={onSuccess} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
