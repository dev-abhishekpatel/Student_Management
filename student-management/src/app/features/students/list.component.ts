import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { AuthService } from '../../core/services/auth.service';
import { Student } from '../../core/models/models';

@Component({
  selector: 'app-students-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './list.component.html'
})
export class StudentsListComponent {
  searchTerm = signal('');
  selectedClass = signal('');
  selectedStatus = signal('');
  selectedStudent = signal<Student | null>(null);

  filteredStudents = computed(() => {
    let list = this.data.students();
    const search = this.searchTerm().toLowerCase().trim();
    const cls = this.selectedClass();
    const st = this.selectedStatus();

    if (search) {
      list = list.filter(s => 
        s.name.toLowerCase().includes(search) || 
        s.studentId.toLowerCase().includes(search) ||
        s.email.toLowerCase().includes(search) ||
        s.rollNumber.toLowerCase().includes(search)
      );
    }

    if (cls) {
      list = list.filter(s => s.classId === cls);
    }

    if (st) {
      list = list.filter(s => s.status === st);
    }

    return list;
  });

  classList = computed(() => this.data.classes().map(c => c.name));

  constructor(
    public data: DataService,
    public auth: AuthService
  ) {}

  viewDetail(student: Student) {
    this.selectedStudent.set(student);
  }

  deleteStudent(id: string) {
    if (confirm('Are you sure you want to delete this student record?')) {
      this.data.deleteStudent(id);
      if (this.selectedStudent()?.id === id) {
        this.selectedStudent.set(null);
      }
    }
  }
}
