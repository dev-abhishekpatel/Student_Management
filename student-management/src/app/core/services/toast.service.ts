import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  public toasts = signal<Toast[]>([]);

  show(message: string, type: ToastType = 'info', title?: string, duration = 4000) {
    const id = 'toast-' + Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, type, title, message, duration };

    this.toasts.update(list => [...list, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }
    return id;
  }

  success(message: string, title: string = 'Success') {
    return this.show(message, 'success', title);
  }

  error(message: string, title: string = 'Error') {
    return this.show(message, 'error', title);
  }

  info(message: string, title: string = 'Information') {
    return this.show(message, 'info', title);
  }

  warning(message: string, title: string = 'Warning') {
    return this.show(message, 'warning', title);
  }

  dismiss(id: string) {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  clearAll() {
    this.toasts.set([]);
  }
}
