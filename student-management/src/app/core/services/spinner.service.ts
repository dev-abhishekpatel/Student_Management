import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SpinnerService {
  public isLoading = signal<boolean>(false);
  public message = signal<string>('Loading...');

  private activeRequests = 0;

  show(msg: string = 'Loading...') {
    this.activeRequests++;
    this.message.set(msg);
    this.isLoading.set(true);
  }

  hide() {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    if (this.activeRequests === 0) {
      this.isLoading.set(false);
    }
  }

  forceHide() {
    this.activeRequests = 0;
    this.isLoading.set(false);
  }
}
