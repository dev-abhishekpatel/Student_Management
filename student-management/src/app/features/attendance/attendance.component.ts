import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { AuthService } from '../../core/services/auth.service';
import { AttendanceRecord } from '../../core/models/models';

interface AttendanceRow {
  studentId: string;
  studentName: string;
  rollNumber: string;
  classId: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  remarks?: string;
}

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendance.component.html'
})
export class AttendanceComponent {
  selectedClass = signal('Class 10-A');
  selectedDate = signal('2026-09-15');
  activeTab = signal<'mark' | 'history'>('mark');

  classList = computed(() => this.data.classes().map(c => c.name));

  // Roster attendance status map
  attendanceRows = signal<AttendanceRow[]>([]);

  constructor(
    public data: DataService,
    public auth: AuthService
  ) {
    this.loadRoster();
  }

  onClassOrDateChange() {
    this.loadRoster();
  }

  loadRoster() {
    const cls = this.selectedClass();
    const dt = this.selectedDate();
    const students = this.data.students().filter(s => s.classId === cls);
    const existingRecs = this.data.attendanceRecords().filter(r => r.classId === cls && r.date === dt);

    const rows: AttendanceRow[] = students.map(s => {
      const existing = existingRecs.find(r => r.studentId === s.id);
      return {
        studentId: s.id!,
        studentName: s.name,
        rollNumber: s.rollNumber,
        classId: cls,
        status: existing ? existing.status : 'Present',
        remarks: existing?.remarks || ''
      };
    });

    this.attendanceRows.set(rows);
  }

  setStatus(index: number, status: 'Present' | 'Absent' | 'Late' | 'Excused') {
    this.attendanceRows.update(rows => {
      const copy = [...rows];
      copy[index].status = status;
      return copy;
    });
  }

  markAll(status: 'Present' | 'Absent') {
    this.attendanceRows.update(rows => rows.map(r => ({ ...r, status })));
  }

  saveAttendance() {
    const dt = this.selectedDate();
    const cls = this.selectedClass();
    const teacherName = this.auth.currentUser()?.name || 'Class Teacher';

    const records: AttendanceRecord[] = this.attendanceRows().map(r => ({
      studentId: r.studentId,
      studentName: r.studentName,
      rollNumber: r.rollNumber,
      classId: cls,
      date: dt,
      status: r.status,
      remarks: r.remarks,
      markedBy: teacherName
    }));

    this.data.markAttendance(records);
    alert('Attendance successfully saved!');
  }

  get stats() {
    const rows = this.attendanceRows();
    const total = rows.length;
    const present = rows.filter(r => r.status === 'Present').length;
    const absent = rows.filter(r => r.status === 'Absent').length;
    const late = rows.filter(r => r.status === 'Late').length;
    const rate = total ? Math.round((present / total) * 100) : 0;
    return { total, present, absent, late, rate };
  }

  historyRecords = computed(() => {
    return this.data.attendanceRecords().filter(r => r.classId === this.selectedClass());
  });
}
