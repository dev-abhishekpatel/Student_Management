import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from '../../core/services/student.service';

@Component({
  selector: 'app-students-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list.component.html'
})
export class StudentsListComponent implements OnInit, OnDestroy {
  students: any[] = [];
  filtered: any[] = [];
  loading = false;
  searchTerm = '';
  private unsubscribe: any;
  constructor(private svc: StudentService, private router: Router) {}
  async ngOnInit() {
    this.loading = true;
    this.unsubscribe = this.svc.listenStudents((items: any[]) => {
      this.students = items;
      this.applyFilter();
      this.loading = false;
    });
  }
  ngOnDestroy() { if (this.unsubscribe) this.unsubscribe(); }

  applyFilter() {
    const t = this.searchTerm.trim().toLowerCase();
    this.filtered = t ? this.students.filter(s => ((s.name||'').toLowerCase().includes(t) || (s.email||'').toLowerCase().includes(t))) : this.students;
  }

  newStudent() { this.router.navigate(['/students/new']); }
  editStudent(id: string) { this.router.navigate([`/students/${id}/edit`]); }
  async deleteStudent(id: string) {
    if (!confirm('Delete student?')) return;
    await this.svc.deleteStudent(id);
    this.students = this.students.filter(s => s.id !== id);
    this.applyFilter();
  }

  exportCSV() {
    const rows = this.filtered.map(s => ({ name: s.name, email: s.email, classId: s.classId }));
    if (!rows.length) return;
    const header = Object.keys(rows[0]).join(',');
    const dataRows = rows.map(r => {
      return [r.name, r.email, r.classId].map(v => '"' + (v||'').toString().replace(/"/g,'""') + '"').join(',');
    });
    const csv = [header, ...dataRows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'students.csv'; a.click(); URL.revokeObjectURL(url);
  }
}
