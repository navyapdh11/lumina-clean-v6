'use client';

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import BookingForm from './BookingForm';

export function BookingButton({
  label = 'Book This Service',
  className,
}: {
  label?: string;
  className?: string;
}) {
  const [toast, setToast] = useState('');

  return (
    <>
      <BookingForm
        trigger={
          <button
            className={`w-full btn-gradient text-white py-3 rounded-xl font-bold ${className ?? ''}`}
            type="button"
          >
            {label}
          </button>
        }
        onSuccess={(msg) => {
          setToast(msg);
          setTimeout(() => setToast(''), 4000);
        }}
      />
      {toast && (
        <div
          className="fixed bottom-6 right-6 btn-gradient text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-[10000]"
          role="status"
          aria-live="polite"
        >
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span className="font-medium">{toast}</span>
        </div>
      )}
    </>
  );
}
