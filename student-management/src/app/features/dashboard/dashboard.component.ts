import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../core/services/student.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  totalStudents = 0;
  loading = true;
  constructor(private svc: StudentService) {
    this.init();
  }
  async init() {
    const list = await this.svc.listStudents();
    this.totalStudents = list.length;
    this.loading = false;
  }
}
