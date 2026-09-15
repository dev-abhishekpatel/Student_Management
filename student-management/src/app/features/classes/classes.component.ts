import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { ClassModel } from '../../core/models/models';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './classes.component.html'
})
export class ClassesComponent {
  name = '';
  section = 'A';
  capacity = 40;
  subjectsStr = '';
  classTeacherName = '';

  classes = computed(() => this.data.classes());

  constructor(public data: DataService) {}

  getStudentCountForClass(className: string): number {
    return this.data.students().filter(s => s.classId === className).length;
  }

  addClass() {
    if (!this.name) return;
    const subjects = this.subjectsStr.split(',').map(s => s.trim()).filter(Boolean);

    const newClass: ClassModel = {
      name: `${this.name}-${this.section}`,
      section: this.section,
      academicYear: '2025-2026',
      classTeacherName: this.classTeacherName || 'Unassigned',
      subjects: subjects.length ? subjects : ['Mathematics', 'Science', 'English'],
      capacity: Number(this.capacity) || 40
    };

    this.data.addClass(newClass);

    this.name = '';
    this.subjectsStr = '';
    this.classTeacherName = '';
  }

  deleteClass(id: string) {
    if (confirm('Delete this class configuration?')) {
      this.data.deleteClass(id);
    }
  }
}
