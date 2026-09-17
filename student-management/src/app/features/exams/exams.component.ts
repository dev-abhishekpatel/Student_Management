import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { SpinnerService } from '../../core/services/spinner.service';
import { Exam, MarkRecord } from '../../core/models/models';

interface MarkEntryRow {
  studentId: string;
  studentName: string;
  rollNumber: string;
  marksObtained: number;
  maxMarks: number;
  comments: string;
}

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exams.component.html'
})
export class ExamsComponent {
  activeTab = signal<'exams' | 'marks'>('exams');
  selectedClass = signal('Class 10-A');
  selectedExamId = signal('ex-2');
  selectedSubject = signal('Mathematics');

  // New Exam fields
  examName = '';
  startDate = '2026-10-10';
  endDate = '2026-10-20';

  // Marks Entry Matrix
  markRows = signal<MarkEntryRow[]>([]);

  classList = computed(() => this.data.classes().map(c => c.name));
  examsList = computed(() => this.data.exams());
  subjectList = ['Mathematics', 'Physics', 'Chemistry', 'English', 'Science'];

  constructor(
    public data: DataService,
    public auth: AuthService,
    private toast: ToastService,
    private spinner: SpinnerService
  ) {
    this.loadMarksMatrix();
  }

  onFilterChange() {
    this.loadMarksMatrix();
  }

  loadMarksMatrix() {
    const cls = this.selectedClass();
    const examId = this.selectedExamId();
    const subj = this.selectedSubject();

    const students = this.data.students().filter(s => s.classId === cls);
    const existingMarks = this.data.marksRecords().filter(m => m.examId === examId && m.classId === cls && m.subjectName === subj);

    const rows: MarkEntryRow[] = students.map(s => {
      const existing = existingMarks.find(m => m.studentId === s.id);
      return {
        studentId: s.id!,
        studentName: s.name,
        rollNumber: s.rollNumber,
        marksObtained: existing ? existing.marksObtained : 85,
        maxMarks: existing ? existing.maxMarks : 100,
        comments: existing?.comments || ''
      };
    });

    this.markRows.set(rows);
  }

  calculateGrade(obtained: number, max: number): 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' {
    const pct = (obtained / (max || 100)) * 100;
    if (pct >= 90) return 'A+';
    if (pct >= 80) return 'A';
    if (pct >= 70) return 'B';
    if (pct >= 60) return 'C';
    if (pct >= 40) return 'D';
    return 'F';
  }

  saveMarks() {
    this.spinner.show('Saving exam result sheet...');
    setTimeout(() => {
      const exam = this.data.exams().find(e => e.id === this.selectedExamId());
      const examName = exam ? exam.name : 'Examination';
      const cls = this.selectedClass();
      const subj = this.selectedSubject();

      const records: MarkRecord[] = this.markRows().map(r => ({
        examId: this.selectedExamId(),
        examName,
        studentId: r.studentId,
        studentName: r.studentName,
        rollNumber: r.rollNumber,
        classId: cls,
        subjectName: subj,
        marksObtained: Number(r.marksObtained),
        maxMarks: Number(r.maxMarks),
        grade: this.calculateGrade(Number(r.marksObtained), Number(r.maxMarks)),
        comments: r.comments
      }));

      this.data.saveMarks(records);
      this.toast.success(`Exam marks for ${subj} (${cls}) saved to database!`, 'Marks Matrix Saved');
      this.spinner.hide();
    }, 350);
  }

  createExam() {
    if (!this.examName) {
      this.toast.warning('Please enter examination title.', 'Validation Error');
      return;
    }
    const newExam: Exam = {
      name: this.examName,
      academicYear: '2025-2026',
      startDate: this.startDate,
      endDate: this.endDate,
      classIds: ['Class 10-A', 'Class 10-B'],
      status: 'Upcoming'
    };

    this.data.addExam(newExam);
    this.toast.success(`Examination "${this.examName}" created!`, 'Exam Created');
    this.examName = '';
  }
}

