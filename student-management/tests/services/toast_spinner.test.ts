import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ToastService } from '../../src/app/core/services/toast.service';
import { SpinnerService } from '../../src/app/core/services/spinner.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    service = new ToastService();
  });

  it('should add success toast to toasts signal', () => {
    service.success('Operation succeeded', 'Done');
    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].type).toBe('success');
    expect(service.toasts()[0].message).toBe('Operation succeeded');
    expect(service.toasts()[0].title).toBe('Done');
  });

  it('should dismiss toast by id', () => {
    const id = service.info('Test info message');
    expect(service.toasts().length).toBe(1);
    service.dismiss(id);
    expect(service.toasts().length).toBe(0);
  });
});

describe('SpinnerService', () => {
  let service: SpinnerService;

  beforeEach(() => {
    service = new SpinnerService();
  });

  it('should show loading spinner with custom message', () => {
    service.show('Loading data...');
    expect(service.isLoading()).toBe(true);
    expect(service.message()).toBe('Loading data...');
  });

  it('should hide spinner when requests complete', () => {
    service.show('Step 1');
    expect(service.isLoading()).toBe(true);
    service.hide();
    expect(service.isLoading()).toBe(false);
  });
});
