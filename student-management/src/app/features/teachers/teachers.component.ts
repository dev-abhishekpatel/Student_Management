import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { ToastService } from '../../core/services/toast.service';
import { Teacher } from '../../core/models/models';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teachers.component.html'
})
export class TeachersComponent {
  searchTerm = signal('');

  // Form fields for adding new teacher
  name = '';
  email = '';
  phone = '';
  qualification = '';
  subjectStr = '';
  assignedClass = 'Class 10-A';
  isClassTeacher = false;

  filteredTeachers = computed(() => {
    let list = this.data.teachers();
    const s = this.searchTerm().toLowerCase().trim();
    if (s) {
      list = list.filter(t => 
        t.name.toLowerCase().includes(s) || 
        t.email.toLowerCase().includes(s) ||
        t.subjects.some(sub => sub.toLowerCase().includes(s))
      );
    }
    return list;
  });

  constructor(
    public data: DataService,
    private toast: ToastService
  ) {}

  addTeacher() {
    if (!this.name || !this.email) {
      this.toast.warning('Please enter both name and email.', 'Incomplete Fields');
      return;
    }
    const subjects = this.subjectStr.split(',').map(s => s.trim()).filter(Boolean);

    const newTeacher: Teacher = {
      teacherId: `TCH-00${this.data.teachers().length + 1}`,
      name: this.name,
      email: this.email,
      phone: this.phone || '+91 9900000000',
      qualification: this.qualification || 'M.Sc, B.Ed',
      subjects: subjects.length ? subjects : ['Mathematics'],
      classIds: [this.assignedClass],
      isClassTeacher: this.isClassTeacher,
      assignedClassId: this.isClassTeacher ? this.assignedClass : undefined,
      status: 'Active',
      photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=random`
    };

    this.data.addTeacher(newTeacher);
    this.toast.success(`Faculty profile for ${this.name} added!`, 'Teacher Saved');

    // Reset Form
    this.name = '';
    this.email = '';
    this.phone = '';
    this.qualification = '';
    this.subjectStr = '';
  }

  deleteTeacher(id: string) {
    const tch = this.data.teachers().find(t => t.id === id);
    if (confirm(`Are you sure you want to delete teacher record for ${tch?.name || 'this faculty member'}?`)) {
      this.data.deleteTeacher(id);
      this.toast.info(`Teacher record ${tch?.name || id} deleted.`, 'Record Removed');
    }
  }
}

