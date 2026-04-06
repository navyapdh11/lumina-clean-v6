'use client';
import { useState, useCallback } from 'react';

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

let count = 0;
const toasts = new Map<string, Toast>();

export function useToast() {
  const [state, setState] = useState<Toast[]>([]);

  const toast = useCallback(({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
    const id = `toast-${++count}`;
    const newToast: Toast = { id, title, description, variant };
    toasts.set(id, newToast);
    setState(Array.from(toasts.values()));
    setTimeout(() => {
      toasts.delete(id);
      setState(Array.from(toasts.values()));
    }, 5000);
  }, []);

  return { toasts: state, toast };
}
