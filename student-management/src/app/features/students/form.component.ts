import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { Student } from '../../core/models/models';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form.component.html'
})
export class StudentFormComponent implements OnInit {
  studentForm!: FormGroup;
  isEditMode = false;
  studentIdToEdit: string | null = null;
  loading = false;

  classes = ['Class 10-A', 'Class 10-B', 'Class 9-B', 'Class 11-A'];

  constructor(
    private fb: FormBuilder,
    private data: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initForm();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.studentIdToEdit = params['id'];
        this.loadStudentData(params['id']);
      }
    });
  }

  initForm() {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      gender: ['Male', Validators.required],
      dob: ['2010-01-01', Validators.required],
      classId: ['Class 10-A', Validators.required],
      sectionId: ['A', Validators.required],
      rollNumber: ['', Validators.required],
      address: ['', Validators.required],
      fatherName: ['', Validators.required],
      motherName: ['', Validators.required],
      parentPhone: ['', Validators.required],
      status: ['Active', Validators.required]
    });
  }

  loadStudentData(id: string) {
    const student = this.data.students().find(s => s.id === id);
    if (student) {
      this.studentForm.patchValue({
        name: student.name,
        email: student.email,
        phone: student.phone,
        gender: student.gender,
        dob: student.dob,
        classId: student.classId,
        sectionId: student.sectionId,
        rollNumber: student.rollNumber,
        address: student.address,
        fatherName: student.parent.fatherName,
        motherName: student.parent.motherName,
        parentPhone: student.parent.phone,
        status: student.status
      });
    }
  }

  onSubmit() {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const val = this.studentForm.value;
    const studentData: Student = {
      studentId: this.isEditMode ? (this.data.students().find(s => s.id === this.studentIdToEdit)?.studentId || 'STD-2026') : `STD-2026-00${this.data.students().length + 1}`,
      name: val.name,
      email: val.email,
      phone: val.phone,
      gender: val.gender,
      dob: val.dob,
      classId: val.classId,
      sectionId: val.sectionId,
      rollNumber: val.rollNumber,
      address: val.address,
      parent: {
        fatherName: val.fatherName,
        motherName: val.motherName,
        phone: val.parentPhone
      },
      status: val.status,
      photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(val.name)}&background=random`
    };

    if (this.isEditMode && this.studentIdToEdit) {
      this.data.updateStudent(this.studentIdToEdit, studentData);
    } else {
      this.data.addStudent(studentData);
    }

    this.loading = false;
    this.router.navigate(['/students']);
  }
}
