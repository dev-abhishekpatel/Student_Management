import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html'
})
export class ReportsComponent {
  selectedClass = signal('Class 10-A');

  classList = computed(() => this.data.classes().map(c => c.name));

  // Compute metrics for selected class
  classStudents = computed(() => {
    return this.data.students().filter(s => s.classId === this.selectedClass());
  });

  attendanceRate = computed(() => {
    const cls = this.selectedClass();
    const recs = this.data.attendanceRecords().filter(r => r.classId === cls);
    if (!recs.length) return 92; // default high attendance metric for demo
    const present = recs.filter(r => r.status === 'Present').length;
    return Math.round((present / recs.length) * 100);
  });

  gradeDistribution = computed(() => {
    const cls = this.selectedClass();
    const marks = this.data.marksRecords().filter(m => m.classId === cls);
    const total = marks.length || 1;
    const aPlus = marks.filter(m => m.grade === 'A+').length;
    const a = marks.filter(m => m.grade === 'A').length;
    const b = marks.filter(m => m.grade === 'B').length;
    const c = marks.filter(m => m.grade === 'C' || m.grade === 'D').length;
    const f = marks.filter(m => m.grade === 'F').length;

    return {
      aPlus: Math.round((aPlus / total) * 100) || 35,
      a: Math.round((a / total) * 100) || 40,
      b: Math.round((b / total) * 100) || 15,
      c: Math.round((c / total) * 100) || 10,
      f: Math.round((f / total) * 100) || 0
    };
  });

  feeCollectionProgress = computed(() => {
    const cls = this.selectedClass();
    const fees = this.data.feeRecords().filter(f => f.classId === cls);
    const totalBilled = fees.reduce((acc, c) => acc + c.amount, 0) || 50000;
    const totalPaid = fees.reduce((acc, c) => acc + c.paidAmount, 0) || 35000;
    const pct = Math.round((totalPaid / totalBilled) * 100);
    return { totalBilled, totalPaid, pct };
  });

  constructor(public data: DataService) {}

  printReport() {
    window.print();
  }
}
