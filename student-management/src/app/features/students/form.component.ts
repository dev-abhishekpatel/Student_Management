import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StudentService } from '../../core/services/student.service';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class StudentFormComponent implements OnInit {
  id: string | null = null;
  model: any = { name: '', email: '', classId: '', phone: '', address: '' };
  photoFile?: File;
  loading = false;
  error = '';

  constructor(private route: ActivatedRoute, private router: Router, private svc: StudentService) {}

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      const s = await this.svc.getStudent(this.id);
      if (s) this.model = s;
    }
  }

  onFileChange(ev: Event) {
    const inp = ev.target as HTMLInputElement;
    if (inp.files && inp.files.length) this.photoFile = inp.files[0];
  }

  async submit() {
    this.loading = true;
    this.error = '';
    try {
      if (this.photoFile) {
        const url = await this.svc.uploadPhoto(this.photoFile, `students/${Date.now()}_${this.photoFile.name}`);
        this.model.photoUrl = url;
      }
      if (this.id) {
        await this.svc.updateStudent(this.id, this.model);
      } else {
        await this.svc.addStudent(this.model);
      }
      this.router.navigate(['/students']);
    } catch (e: any) {
      this.error = e?.message || 'Save failed';
    } finally {
      this.loading = false;
    }
  }
}
