'use client';
import { useToast } from '@/lib/hooks/use-toast';
import { Toast, ToastTitle, ToastDescription, ToastProvider, ToastViewport } from '@/components/ui/toast';

export function Toaster() {
  const { toasts } = useToast();
  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, ...props }) => (
        <Toast key={id} {...props}>
          <div>
            <ToastTitle>{title}</ToastTitle>
            <ToastDescription>{description}</ToastDescription>
          </div>
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
