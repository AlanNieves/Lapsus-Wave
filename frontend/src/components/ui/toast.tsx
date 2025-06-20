'use client';

import { Toaster, toast as sonnerToast } from 'sonner';

export function ToastProvider() {
  return <Toaster position="top-right" richColors />;
}

export const toast = sonnerToast;