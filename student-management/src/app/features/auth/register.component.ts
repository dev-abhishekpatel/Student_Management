import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';
import { ToastService } from '../../core/services/toast.service';
import { SpinnerService } from '../../core/services/spinner.service';
import { Role } from '../../core/models/models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  role: Role = 'student';
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  loading = false;
  error = '';
  registeredSuccess = false;
  successMessage = '';

  // Student specific fields
  gender: 'Male' | 'Female' | 'Other' = 'Male';
  dob = '2010-06-15';
  classId = 'Class 10-A';
  sectionId = 'A';
  rollNumber = '105';
  fatherName = '';
  motherName = '';
  parentPhone = '';

  // Teacher specific fields
  qualification = 'M.Sc in Mathematics, B.Ed';
  subjectsInput = 'Mathematics, Physics';
  assignedClassId = 'Class 10-A';
  teacherPhone = '';

  constructor(
    public auth: AuthService,
    private data: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService,
    private spinner: SpinnerService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['role'] === 'admin' || params['role'] === 'teacher' || params['role'] === 'student') {
        this.role = params['role'] as Role;
      }
    });
  }

  selectRole(targetRole: Role) {
    this.role = targetRole;
    this.error = '';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async submit() {
    this.error = '';
    this.registeredSuccess = false;

    if (!this.fullName || !this.email || !this.password) {
      this.error = 'Please fill in all required fields.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters.';
      return;
    }

    this.loading = true;
    this.spinner.show(`Creating ${this.role.toUpperCase()} account...`);

    try {
      let createdDetailId = '';

      if (this.role === 'student') {
        const studentId = 'STD-2026-' + Math.floor(100 + Math.random() * 900);
        const newStudent = this.data.addStudent({
          studentId: studentId,
          name: this.fullName,
          email: this.email,
          phone: this.parentPhone || '+91 9876543210',
          gender: this.gender,
          dob: this.dob,
          classId: this.classId,
          sectionId: this.sectionId,
          rollNumber: this.rollNumber || '108',
          address: 'School Residential Quarter',
          parent: {
            fatherName: this.fatherName || 'Parent Name',
            motherName: this.motherName || 'Mother Name',
            phone: this.parentPhone || '+91 9876543210'
          },
          photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(this.fullName)}&background=10b981&color=fff`,
          status: 'Active'
        });
        createdDetailId = newStudent.id!;
      } else if (this.role === 'teacher') {
        const teacherId = 'TCH-' + Math.floor(100 + Math.random() * 900);
        const newTeacher = this.data.addTeacher({
          teacherId: teacherId,
          name: this.fullName,
          email: this.email,
          phone: this.teacherPhone || '+91 9988776655',
          qualification: this.qualification,
          subjects: this.subjectsInput.split(',').map(s => s.trim()),
          classIds: [this.assignedClassId],
          isClassTeacher: true,
          assignedClassId: this.assignedClassId,
          status: 'Active'
        });
        createdDetailId = newTeacher.id!;
      }

      const resProfile = await this.auth.register(this.fullName, this.email, this.password, this.role, {
        studentId: createdDetailId,
        teacherId: createdDetailId
      });

      this.registeredSuccess = true;
      if (resProfile.active) {
        this.toast.success(`Welcome ${this.fullName}!`, `${this.role.toUpperCase()} Account Activated.`);
        this.router.navigate(['/dashboard']);
      } else {
        this.successMessage = `Registration successful! Your ${this.role.toUpperCase()} account is pending Administrator approval before you can log in.`;
        this.toast.warning('Account Pending Approval', 'Admin permission required to activate account.');
      }
    } catch (e: any) {
      this.error = e?.message || 'Registration failed. Please try again.';
      this.toast.error(this.error, 'Registration Failed');
    } finally {
      this.loading = false;
      this.spinner.hide();
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
