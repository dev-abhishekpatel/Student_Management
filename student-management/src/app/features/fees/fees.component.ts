import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { ToastService } from '../../core/services/toast.service';
import { SpinnerService } from '../../core/services/spinner.service';
import { FeeRecord } from '../../core/models/models';

@Component({
  selector: 'app-fees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fees.component.html'
})
export class FeesComponent {
  selectedStatus = signal('');

  // Record payment fields
  selectedFeeId = signal<string | null>(null);
  payAmount = 5000;
  paymentRef = '';

  // Add fee structure fields
  newStudentId = '';
  feeType: 'Tuition Fee' | 'Exam Fee' | 'Library Fee' | 'Transport Fee' | 'Annual Fee' = 'Tuition Fee';
  totalAmount = 15000;
  dueDate = '2026-10-01';

  filteredFees = computed(() => {
    let list = this.data.feeRecords();
    const st = this.selectedStatus();
    if (st) {
      list = list.filter(f => f.status === st);
    }
    return list;
  });

  totals = computed(() => {
    const records = this.data.feeRecords();
    const billed = records.reduce((acc, curr) => acc + curr.amount, 0);
    const paid = records.reduce((acc, curr) => acc + curr.paidAmount, 0);
    const due = records.reduce((acc, curr) => acc + curr.dueAmount, 0);
    return { billed, paid, due };
  });

  studentsList = computed(() => this.data.students());

  constructor(
    public data: DataService,
    private toast: ToastService,
    private spinner: SpinnerService
  ) {}

  openPaymentModal(fee: FeeRecord) {
    this.selectedFeeId.set(fee.id!);
    this.payAmount = fee.dueAmount;
    this.paymentRef = `TXN-${Math.floor(10000 + Math.random() * 90000)}`;
  }

  submitPayment() {
    const id = this.selectedFeeId();
    if (!id || this.payAmount <= 0) {
      this.toast.warning('Please enter a valid payment amount.', 'Invalid Amount');
      return;
    }
    this.spinner.show('Processing payment...');
    setTimeout(() => {
      const today = new Date().toISOString().split('T')[0];
      this.data.updateFeePayment(id, Number(this.payAmount), today, this.paymentRef);
      this.toast.success(`Payment of ₹${this.payAmount} recorded successfully! Ref: ${this.paymentRef}`, 'Payment Confirmed');
      this.spinner.hide();
    }, 350);
  }

  createFeeNotice() {
    if (!this.newStudentId) {
      this.toast.warning('Please select a student.', 'Missing Selection');
      return;
    }
    const student = this.data.students().find(s => s.id === this.newStudentId);
    if (!student) return;

    this.spinner.show('Generating fee record...');
    setTimeout(() => {
      const newFee: FeeRecord = {
        studentId: student.id!,
        studentName: student.name,
        classId: student.classId,
        feeType: this.feeType,
        amount: Number(this.totalAmount),
        paidAmount: 0,
        dueAmount: Number(this.totalAmount),
        dueDate: this.dueDate,
        status: 'Pending'
      };

      this.data.addFeeRecord(newFee);
      this.toast.success(`Fee invoice generated for ${student.name} (${this.feeType}: ₹${this.totalAmount})`, 'Invoice Generated');
      this.spinner.hide();
    }, 350);
  }
}
