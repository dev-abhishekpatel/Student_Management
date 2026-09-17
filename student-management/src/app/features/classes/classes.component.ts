import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { ToastService } from '../../core/services/toast.service';
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

  constructor(
    public data: DataService,
    private toast: ToastService
  ) {}

  getStudentCountForClass(className: string): number {
    return this.data.students().filter(s => s.classId === className).length;
  }

  addClass() {
    if (!this.name) {
      this.toast.warning('Please enter a class name.', 'Missing Class Name');
      return;
    }
    const subjects = this.subjectsStr.split(',').map(s => s.trim()).filter(Boolean);

    const className = `${this.name}-${this.section}`;
    const newClass: ClassModel = {
      name: className,
      section: this.section,
      academicYear: '2025-2026',
      classTeacherName: this.classTeacherName || 'Unassigned',
      subjects: subjects.length ? subjects : ['Mathematics', 'Science', 'English'],
      capacity: Number(this.capacity) || 40
    };

    this.data.addClass(newClass);
    this.toast.success(`Academic Class ${className} created successfully!`, 'Class Created');

    this.name = '';
    this.subjectsStr = '';
    this.classTeacherName = '';
  }

  deleteClass(id: string) {
    const cls = this.data.classes().find(c => c.id === id);
    if (confirm(`Are you sure you want to delete class ${cls?.name || id}?`)) {
      this.data.deleteClass(id);
      this.toast.info(`Class configuration ${cls?.name || id} removed.`, 'Class Removed');
    }
  }
}

