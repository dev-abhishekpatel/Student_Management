import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {

  totalStudents = computed(() => this.data.students().length);
  totalTeachers = computed(() => this.data.teachers().length);
  totalClasses = computed(() => this.data.classes().length);

  totalFeeCollected = computed(() => {
    return this.data.feeRecords().reduce((acc, curr) => acc + curr.paidAmount, 0);
  });

  totalFeeDue = computed(() => {
    return this.data.feeRecords().reduce((acc, curr) => acc + curr.dueAmount, 0);
  });

  todayAttendanceCount = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    const recs = this.data.attendanceRecords().filter(r => r.date === today || r.date === '2026-09-15');
    const present = recs.filter(r => r.status === 'Present').length;
    return { present, total: recs.length || this.totalStudents() };
  });

  recentNotices = computed(() => this.data.notices().slice(0, 3));
  recentStudents = computed(() => this.data.students().slice(0, 4));

  constructor(
    public auth: AuthService,
    public data: DataService
  ) {}
}
