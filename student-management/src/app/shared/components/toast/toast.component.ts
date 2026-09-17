import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}

  dismiss(id: string) {
    this.toastService.dismiss(id);
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'success': return 'bi-check-circle-fill text-success';
      case 'error': return 'bi-exclamation-triangle-fill text-danger';
      case 'warning': return 'bi-exclamation-circle-fill text-warning';
      case 'info': default: return 'bi-info-circle-fill text-info';
    }
  }

  getBorderClass(type: string): string {
    switch (type) {
      case 'success': return 'border-start border-4 border-success';
      case 'error': return 'border-start border-4 border-danger';
      case 'warning': return 'border-start border-4 border-warning';
      case 'info': default: return 'border-start border-4 border-info';
    }
  }
}
