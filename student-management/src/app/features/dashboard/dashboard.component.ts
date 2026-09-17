import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';
import { ToastService } from '../../core/services/toast.service';
import { Student, AttendanceRecord, MarkRecord, FeeRecord, TimetableEntry } from '../../core/models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  // Pay fee modal state for students
  showFeeModal = signal(false);
  payAmount = signal<number>(5000);
  selectedFee = signal<FeeRecord | null>(null);

  // Admin stats
  totalStudents = computed(() => this.data.students().length);
  totalTeachers = computed(() => this.data.teachers().length);
  totalClasses = computed(() => this.data.classes().length);
  totalFeeCollected = computed(() => this.data.feeRecords().reduce((acc, curr) => acc + curr.paidAmount, 0));
  totalFeeDue = computed(() => this.data.feeRecords().reduce((acc, curr) => acc + curr.dueAmount, 0));

  todayAttendanceCount = computed(() => {
    const recs = this.data.attendanceRecords();
    const present = recs.filter(r => r.status === 'Present').length;
    return { present, total: recs.length || this.totalStudents() };
  });

  // Student specific computations
  currentStudent = computed<Student | undefined>(() => {
    const user = this.auth.currentUser();
    if (user?.role === 'student') {
      return this.data.students().find(s => s.id === 'st-101' || s.email === user.email) || this.data.students()[0];
    }
    return undefined;
  });

  studentAttendance = computed(() => {
    const st = this.currentStudent();
    if (!st) return { percentage: 95, present: 19, total: 20, recs: [] };
    const recs = this.data.attendanceRecords().filter(r => r.studentId === st.id || r.studentName === st.name);
    const present = recs.filter(r => r.status === 'Present' || r.status === 'Late').length;
    const total = recs.length || 20;
    const percentage = Math.round((present / (total || 1)) * 100);
    return { percentage, present, total, recs };
  });

  studentMarks = computed<MarkRecord[]>(() => {
    const st = this.currentStudent();
    if (!st) return [];
    return this.data.marksRecords().filter(m => m.studentId === st.id || m.studentName === st.name);
  });

  studentFees = computed<FeeRecord[]>(() => {
    const st = this.currentStudent();
    if (!st) return [];
    return this.data.feeRecords().filter(f => f.studentId === st.id || f.studentName === st.name);
  });

  studentTimetable = computed<TimetableEntry[]>(() => {
    const st = this.currentStudent();
    const classId = st?.classId || 'Class 10-A';
    return this.data.timetables().filter(t => t.classId === classId);
  });

  // Teacher specific computations
  currentTeacher = computed(() => {
    const user = this.auth.currentUser();
    if (user?.role === 'teacher') {
      return this.data.teachers().find(t => t.id === 'tch-1' || t.email === user.email) || this.data.teachers()[0];
    }
    return undefined;
  });

  teacherTimetable = computed(() => {
    const tch = this.currentTeacher();
    if (!tch) return [];
    return this.data.timetables().filter(t => t.teacherName.includes('Robert') || t.teacherName === tch?.name);
  });

  recentNotices = computed(() => this.data.notices().slice(0, 4));
  recentStudents = computed(() => this.data.students().slice(0, 4));

  constructor(
    public auth: AuthService,
    public data: DataService,
    private toast: ToastService
  ) {}

  openPayModal(fee: FeeRecord) {
    this.selectedFee.set(fee);
    this.payAmount.set(fee.dueAmount > 0 ? fee.dueAmount : 1000);
    this.showFeeModal.set(true);
  }

  closePayModal() {
    this.showFeeModal.set(false);
  }

  processPayment() {
    const fee = this.selectedFee();
    if (!fee) return;
    const amount = Number(this.payAmount());
    const txnRef = 'TXN-' + Math.floor(100000 + Math.random() * 900000);
    const today = new Date().toISOString().split('T')[0];
    
    this.data.updateFeePayment(fee.id!, amount, today, txnRef);
    this.toast.success(`Payment of ₹${amount} successful!`, `Receipt ${txnRef} generated & saved to database.`);
    this.closePayModal();
  }
}
