'use client';

import { useActionState, useEffect, useId } from 'react';
import { useFormStatus } from 'react-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Calendar, Clock, User, Phone, FileText, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { submitBooking, type BookingState } from '../actions';
import { BOOKING_SERVICES } from '../lib/validation';

const initialState: BookingState = {
  success: false,
  message: '',
};

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="mt-1.5 text-xs text-red-500 flex items-center gap-1" role="alert">
      <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />
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
      className="relative w-full overflow-hidden rounded-2xl font-bold text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed transition-all group"
    >
      {/* Background */}
      <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600" />
      {/* Hover shimmer */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      {/* Text */}
      <span className="relative flex items-center justify-center gap-2 text-white">
        {pending ? (
          <>
            <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Booking...
          </>
        ) : (
          <>
            Confirm & Book
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </span>
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
    <form action={formAction} className="space-y-5" noValidate>
      {/* Service */}
      <div>
        <label htmlFor={serviceId} className="flex items-center gap-1.5 text-sm font-semibold mb-2 text-emerald-text">
          <Sparkles className="h-3.5 w-3.5 text-emerald-primary" />
          Service Type <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <div className="relative">
          <select
            id={serviceId}
            name="service"
            defaultValue="End of Lease Cleaning"
            className="w-full appearance-none pl-4 pr-10 py-3.5 rounded-xl border border-emerald-outline/30 bg-emerald-surface-low dark:bg-emerald-surface text-emerald-text focus:outline-none focus:ring-2 focus:ring-emerald-primary/50 focus:border-emerald-primary transition-all text-sm"
            aria-describedby={state.errors?.service ? `${serviceId}-error` : undefined}
            aria-invalid={!!state.errors?.service}
          >
            {BOOKING_SERVICES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          {/* Dropdown chevron */}
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-text-muted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <FieldError id={`${serviceId}-error`} error={state.errors?.service} />
      </div>

      {/* Date + Time */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={dateId} className="flex items-center gap-1.5 text-sm font-semibold mb-2 text-emerald-text">
            <Calendar className="h-3.5 w-3.5 text-emerald-primary" />
            Date <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id={dateId}
            name="date"
            type="date"
            className="w-full px-4 py-3.5 rounded-xl border border-emerald-outline/30 bg-emerald-surface-low dark:bg-emerald-surface text-emerald-text focus:outline-none focus:ring-2 focus:ring-emerald-primary/50 focus:border-emerald-primary transition-all text-sm"
            aria-describedby={state.errors?.date ? `${dateId}-error` : undefined}
            aria-invalid={!!state.errors?.date}
          />
          <FieldError id={`${dateId}-error`} error={state.errors?.date} />
        </div>
        <div>
          <label htmlFor={timeId} className="flex items-center gap-1.5 text-sm font-semibold mb-2 text-emerald-text">
            <Clock className="h-3.5 w-3.5 text-emerald-primary" />
            Time <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <select
              id={timeId}
              name="time"
              className="w-full appearance-none pl-4 pr-10 py-3.5 rounded-xl border border-emerald-outline/30 bg-emerald-surface-low dark:bg-emerald-surface text-emerald-text focus:outline-none focus:ring-2 focus:ring-emerald-primary/50 focus:border-emerald-primary transition-all text-sm"
              aria-describedby={state.errors?.time ? `${timeId}-error` : undefined}
              aria-invalid={!!state.errors?.time}
            >
              <option value="">Select</option>
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
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-text-muted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <FieldError id={`${timeId}-error`} error={state.errors?.time} />
        </div>
      </div>

      {/* Name + Phone */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={nameId} className="flex items-center gap-1.5 text-sm font-semibold mb-2 text-emerald-text">
            <User className="h-3.5 w-3.5 text-emerald-primary" />
            Your Name
          </label>
          <input
            id={nameId}
            name="name"
            type="text"
            placeholder="Jane Smith"
            autoComplete="name"
            className="w-full px-4 py-3.5 rounded-xl border border-emerald-outline/30 bg-emerald-surface-low dark:bg-emerald-surface text-emerald-text placeholder:text-emerald-text-muted/60 focus:outline-none focus:ring-2 focus:ring-emerald-primary/50 focus:border-emerald-primary transition-all text-sm"
            aria-describedby={state.errors?.name ? `${nameId}-error` : undefined}
            aria-invalid={!!state.errors?.name}
          />
          <FieldError id={`${nameId}-error`} error={state.errors?.name} />
        </div>
        <div>
          <label htmlFor={phoneId} className="flex items-center gap-1.5 text-sm font-semibold mb-2 text-emerald-text">
            <Phone className="h-3.5 w-3.5 text-emerald-primary" />
            Phone
          </label>
          <input
            id={phoneId}
            name="phone"
            type="tel"
            placeholder="0412 345 678"
            autoComplete="tel"
            className="w-full px-4 py-3.5 rounded-xl border border-emerald-outline/30 bg-emerald-surface-low dark:bg-emerald-surface text-emerald-text placeholder:text-emerald-text-muted/60 focus:outline-none focus:ring-2 focus:ring-emerald-primary/50 focus:border-emerald-primary transition-all text-sm"
            aria-describedby={state.errors?.phone ? `${phoneId}-error` : undefined}
            aria-invalid={!!state.errors?.phone}
          />
          <FieldError id={`${phoneId}-error`} error={state.errors?.phone} />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor={notesId} className="flex items-center gap-1.5 text-sm font-semibold mb-2 text-emerald-text">
          <FileText className="h-3.5 w-3.5 text-emerald-primary" />
          Additional Notes
        </label>
        <textarea
          id={notesId}
          name="notes"
          rows={3}
          placeholder="Access codes, special instructions, parking info..."
          className="w-full px-4 py-3.5 rounded-xl border border-emerald-outline/30 bg-emerald-surface-low dark:bg-emerald-surface text-emerald-text placeholder:text-emerald-text-muted/60 focus:outline-none focus:ring-2 focus:ring-emerald-primary/50 focus:border-emerald-primary transition-all text-sm resize-none"
          aria-describedby={state.errors?.notes ? `${notesId}-error` : undefined}
          aria-invalid={!!state.errors?.notes}
        />
        <FieldError id={`${notesId}-error`} error={state.errors?.notes} />
      </div>

      {/* General error */}
      {state.message && !state.success && (
        <p className="text-xs text-red-500 flex items-center gap-1.5 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800" role="alert">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
          {state.message}
        </p>
      )}

      {/* Trust indicators */}
      <div className="flex items-center justify-center gap-5 text-xs text-emerald-text-muted">
        <span className="flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          Insured & Verified
        </span>
        <span className="w-px h-3 bg-emerald-outline/30" />
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          No call-out fee
        </span>
        <span className="w-px h-3 bg-emerald-outline/30" />
        <span>Cancel anytime</span>
      </div>

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
  trigger?: React.ReactNode;
  open?: boolean;
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

  if (trigger === undefined && open === undefined) {
    return <BookingFormInner onSuccess={onSuccess} />;
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] animate-in fade-in duration-200" />
        {/* Modal panel */}
        <Dialog.Content
          className="fixed z-[10000] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md"
          aria-labelledby={titleId}
        >
          <div className="relative glass-heavy rounded-3xl overflow-hidden shadow-2xl">
            {/* Header stripe */}
            <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500" />

            <div className="p-8">
              {/* Header row */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <Dialog.Title id={titleId} className="font-headline font-extrabold text-2xl gradient-text">
                    Book Your Clean
                  </Dialog.Title>
                  <p className="text-emerald-text-muted text-sm mt-1">Typically confirmed within 2 minutes</p>
                </div>
                <Dialog.Close asChild>
                  <button
                    aria-label="Close booking dialog"
                    className="rounded-xl p-2 hover:bg-emerald-surface-low transition-colors -mr-2 -mt-2"
                    type="button"
                  >
                    <X className="h-5 w-5 text-emerald-text-muted" />
                  </button>
                </Dialog.Close>
              </div>

              <BookingFormInner onSuccess={onSuccess} />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
