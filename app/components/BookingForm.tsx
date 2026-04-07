'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { submitBooking, type BookingState } from '../actions';

const initialState: BookingState = {
  success: false,
  message: '',
};

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

export default function BookingForm({
  onSuccess,
}: {
  onSuccess: (message: string) => void;
}) {
  const [state, formAction] = useActionState(submitBooking, initialState);

  useEffect(() => {
    if (state.success) {
      onSuccess(state.message);
    }
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <div>
        <label htmlFor="service" className="block text-sm font-medium mb-2 text-emerald-text">
          Service Type
        </label>
        <select
          id="service"
          name="service"
          defaultValue="End of Lease Cleaning"
          className="w-full p-4 rounded-2xl border border-emerald-outline bg-emerald-surface text-emerald-text"
          aria-invalid={!!state.errors?.service}
        >
          <option>End of Lease Cleaning</option>
          <option>Standard Home Cleaning</option>
          <option>Carpet Steam Cleaning</option>
          <option>Office Deep Clean</option>
          <option>Mould Remediation</option>
          <option>Hazardous Bio Clean</option>
        </select>
        {state.errors?.service && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {state.errors.service}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-2 text-emerald-text">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            className="w-full p-4 rounded-2xl border border-emerald-outline bg-emerald-surface text-emerald-text"
            aria-invalid={!!state.errors?.date}
            required
          />
          {state.errors?.date && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {state.errors.date}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="time" className="block text-sm font-medium mb-2 text-emerald-text">
            Time
          </label>
          <input
            id="time"
            name="time"
            type="time"
            className="w-full p-4 rounded-2xl border border-emerald-outline bg-emerald-surface text-emerald-text"
            aria-invalid={!!state.errors?.time}
            required
          />
          {state.errors?.time && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {state.errors.time}
            </p>
          )}
        </div>
      </div>

      {state.message && !state.success && (
        <p className="text-sm text-red-600" role="alert">
          {state.message}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
