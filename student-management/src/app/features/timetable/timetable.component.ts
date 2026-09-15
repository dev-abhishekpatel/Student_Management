import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { TimetableEntry } from '../../core/models/models';

@Component({
  selector: 'app-timetable',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './timetable.component.html'
})
export class TimetableComponent {
  selectedClass = signal('Class 10-A');

  days: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  periods = [1, 2, 3, 4, 5];

  // Add entry modal fields
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' = 'Monday';
  period = 1;
  timeSlot = '08:30 - 09:15 AM';
  subjectName = 'Mathematics';
  teacherName = 'Dr. Robert D\'Souza';
  roomNumber = 'Room 101';

  classList = computed(() => this.data.classes().map(c => c.name));

  constructor(public data: DataService) {}

  getEntry(day: string, period: number): TimetableEntry | undefined {
    return this.data.timetables().find(
      t => t.classId === this.selectedClass() && t.day === day && t.period === period
    );
  }

  addEntry() {
    const entry: TimetableEntry = {
      classId: this.selectedClass(),
      day: this.day,
      period: Number(this.period),
      timeSlot: this.timeSlot,
      subjectName: this.subjectName,
      teacherName: this.teacherName,
      roomNumber: this.roomNumber
    };

    this.data.addTimetableEntry(entry);
  }

  deleteEntry(id: string) {
    if (confirm('Remove timetable slot?')) {
      this.data.deleteTimetableEntry(id);
    }
  }
}
