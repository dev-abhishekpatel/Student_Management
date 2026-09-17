import { Injectable, signal } from '@angular/core';
import {
  collection, doc, updateDoc, deleteDoc,
  onSnapshot, setDoc
} from 'firebase/firestore';
import { environment } from '../../../environments/environment';
import {
  Student, Teacher, ClassModel, Subject, AttendanceRecord,
  TimetableEntry, Exam, MarkRecord, FeeRecord, Notice, SchoolSettings
} from '../models/models';
import { firebaseDb } from '../firebase/firebase.config';

@Injectable({ providedIn: 'root' })
export class DataService {
  private db = firebaseDb;

  // Initial fallbacks & signal stores
  public students = signal<Student[]>([
    {
      id: 'st-101',
      studentId: 'STD-2026-001',
      name: 'Aarav Patel',
      email: 'aarav.patel@school.com',
      phone: '+91 9876543210',
      gender: 'Male',
      dob: '2010-05-14',
      classId: 'Class 10-A',
      sectionId: 'A',
      rollNumber: '101',
      address: '42 Mg Road, Sector 15, City',
      parent: { fatherName: 'Rajesh Patel', motherName: 'Sunita Patel', phone: '+91 9876543211' },
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      status: 'Active'
    }
  ]);

  public teachers = signal<Teacher[]>([
    {
      id: 'tch-1',
      teacherId: 'TCH-001',
      name: 'Dr. Robert D\'Souza',
      email: 'robert@school.com',
      phone: '+91 9988776655',
      qualification: 'Ph.D in Mathematics',
      subjects: ['Mathematics', 'Statistics'],
      classIds: ['Class 10-A', 'Class 10-B', 'Class 11-A'],
      isClassTeacher: true,
      assignedClassId: 'Class 10-A',
      status: 'Active'
    }
  ]);

  public classes = signal<ClassModel[]>([
    {
      id: 'cls-1',
      name: 'Class 10-A',
      section: 'A',
      academicYear: '2025-2026',
      classTeacherId: 'tch-1',
      classTeacherName: 'Dr. Robert D\'Souza',
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science'],
      capacity: 40
    }
  ]);

  public attendanceRecords = signal<AttendanceRecord[]>([
    { id: 'att-1', studentId: 'st-101', studentName: 'Aarav Patel', rollNumber: '101', classId: 'Class 10-A', date: '2026-09-15', status: 'Present', markedBy: 'Dr. Robert D\'Souza' },
  ]);

  public exams = signal<Exam[]>([
    { id: 'ex-1', name: 'Mid-Term Examinations 2026', academicYear: '2025-2026', startDate: '2026-10-10', endDate: '2026-10-20', classIds: ['Class 10-A', 'Class 10-B'], status: 'Upcoming' },
  ]);

  public marksRecords = signal<MarkRecord[]>([
    { id: 'mrk-1', examId: 'ex-2', examName: 'Unit Assessment I', studentId: 'st-101', studentName: 'Aarav Patel', rollNumber: '101', classId: 'Class 10-A', subjectName: 'Mathematics', marksObtained: 94, maxMarks: 100, grade: 'A+', comments: 'Excellent performance' },
  ]);

  public feeRecords = signal<FeeRecord[]>([
    { id: 'fee-1', studentId: 'st-101', studentName: 'Aarav Patel', classId: 'Class 10-A', feeType: 'Tuition Fee', amount: 15000, paidAmount: 15000, dueAmount: 0, dueDate: '2026-09-01', status: 'Paid', paymentDate: '2026-08-28', transactionRef: 'TXN-99881' },
  ]);

  public notices = signal<Notice[]>([
    { id: 'ntc-1', title: 'Parent-Teacher Meeting Scheduled', message: 'Annual Parent-Teacher Interaction session scheduled for Saturday from 9:00 AM to 1:00 PM.', category: 'General', targetAudience: 'All', isPinned: true, authorName: 'Principal Office', createdAt: '2026-09-14' }
  ]);

  public schoolSettings = signal<SchoolSettings>({
    schoolName: 'St. Xavier International Academy',
    code: 'SXIA-2026',
    academicYear: '2025-2026',
    email: 'info@stxavieracademy.edu',
    phone: '+91 11 2345 6789',
    address: 'Knowledge Campus, Grand Trunk Road, New Delhi',
    principalName: 'Dr. Elizabeth Vance',
    themeColor: '#4f46e5'
  });

  public timetables = signal<TimetableEntry[]>([
    { id: 'tt-1', classId: 'Class 10-A', day: 'Monday', period: 1, timeSlot: '08:30 - 09:15 AM', subjectName: 'Mathematics', teacherName: 'Dr. Robert D\'Souza', roomNumber: 'Room 101' }
  ]);

  public dbStatus = signal<'connected' | 'syncing' | 'offline'>('connected');
  public lastSyncedAt = signal<string>(new Date().toLocaleTimeString());

  constructor() {
    this.initFirestoreSync();
  }

  public initFirestoreSync() {
    this.dbStatus.set('syncing');
    try {
      // 1. Sync Students
      onSnapshot(collection(this.db, 'students'), (snap) => {
        if (!snap.empty) {
          const list: Student[] = [];
          snap.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() } as Student));
          this.students.set(list);
        } else {
          this.students().forEach(s => {
            try { setDoc(doc(this.db, 'students', s.id!), s); } catch (e) { }
          });
        }
        this.lastSyncedAt.set(new Date().toLocaleTimeString());
      }, () => { });

      // 2. Sync Teachers
      onSnapshot(collection(this.db, 'teachers'), (snap) => {
        if (!snap.empty) {
          const list: Teacher[] = [];
          snap.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() } as Teacher));
          this.teachers.set(list);
        } else {
          this.teachers().forEach(t => {
            try { setDoc(doc(this.db, 'teachers', t.id!), t); } catch (e) { }
          });
        }
      }, () => { });

      // 3. Sync Classes
      onSnapshot(collection(this.db, 'classes'), (snap) => {
        if (!snap.empty) {
          const list: ClassModel[] = [];
          snap.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() } as ClassModel));
          this.classes.set(list);
        } else {
          this.classes().forEach(c => {
            try { setDoc(doc(this.db, 'classes', c.id!), c); } catch (e) { }
          });
        }
      }, () => { });

      // 4. Sync Attendance
      onSnapshot(collection(this.db, 'attendance'), (snap) => {
        if (!snap.empty) {
          const list: AttendanceRecord[] = [];
          snap.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() } as AttendanceRecord));
          this.attendanceRecords.set(list);
        } else {
          this.attendanceRecords().forEach(a => {
            try { setDoc(doc(this.db, 'attendance', a.id!), a); } catch (e) { }
          });
        }
      }, () => { });

      // 5. Sync Exams
      onSnapshot(collection(this.db, 'exams'), (snap) => {
        if (!snap.empty) {
          const list: Exam[] = [];
          snap.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() } as Exam));
          this.exams.set(list);
        } else {
          this.exams().forEach(e => {
            try { setDoc(doc(this.db, 'exams', e.id!), e); } catch (e) { }
          });
        }
      }, () => { });

      // 6. Sync Marks
      onSnapshot(collection(this.db, 'marks'), (snap) => {
        if (!snap.empty) {
          const list: MarkRecord[] = [];
          snap.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() } as MarkRecord));
          this.marksRecords.set(list);
        } else {
          this.marksRecords().forEach(m => {
            try { setDoc(doc(this.db, 'marks', m.id!), m); } catch (e) { }
          });
        }
      }, () => { });

      // 7. Sync Fees
      onSnapshot(collection(this.db, 'fees'), (snap) => {
        if (!snap.empty) {
          const list: FeeRecord[] = [];
          snap.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() } as FeeRecord));
          this.feeRecords.set(list);
        } else {
          this.feeRecords().forEach(f => {
            try { setDoc(doc(this.db, 'fees', f.id!), f); } catch (e) { }
          });
        }
      }, () => { });

      // 8. Sync Notices
      onSnapshot(collection(this.db, 'notices'), (snap) => {
        if (!snap.empty) {
          const list: Notice[] = [];
          snap.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() } as Notice));
          this.notices.set(list);
        } else {
          this.notices().forEach(n => {
            try { setDoc(doc(this.db, 'notices', n.id!), n); } catch (e) { }
          });
        }
      }, () => { });

      // 9. Sync Timetable
      onSnapshot(collection(this.db, 'timetable'), (snap) => {
        if (!snap.empty) {
          const list: TimetableEntry[] = [];
          snap.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() } as TimetableEntry));
          this.timetables.set(list);
        } else {
          this.timetables().forEach(t => {
            try { setDoc(doc(this.db, 'timetable', t.id!), t); } catch (e) { }
          });
        }
      }, () => { });

      // 10. Sync Settings
      onSnapshot(doc(this.db, 'settings', 'school'), (docSnap) => {
        if (docSnap.exists()) {
          this.schoolSettings.set(docSnap.data() as SchoolSettings);
        } else {
          try { setDoc(doc(this.db, 'settings', 'school'), this.schoolSettings()); } catch (e) { }
        }
      }, () => { });

      this.dbStatus.set('connected');
    } catch (e) {
      this.dbStatus.set('connected');
    }
  }

  // CRUD Helpers for Students
  addStudent(item: Student) {
    const id = item.id || 'st-' + Date.now();
    const newStudent = { ...item, id };
    this.students.update(list => [newStudent, ...list.filter(s => s.id !== id)]);
    try { setDoc(doc(this.db, 'students', id), newStudent); } catch (e) { }
    return newStudent;
  }

  updateStudent(id: string, updated: Partial<Student>) {
    this.students.update(list => list.map(s => s.id === id ? { ...s, ...updated } : s));
    try { updateDoc(doc(this.db, 'students', id), updated as any); } catch (e) { }
  }

  deleteStudent(id: string) {
    this.students.update(list => list.filter(s => s.id !== id));
    try { deleteDoc(doc(this.db, 'students', id)); } catch (e) { }
  }

  // CRUD Helpers for Teachers
  addTeacher(item: Teacher) {
    const id = item.id || 'tch-' + Date.now();
    const newTeacher = { ...item, id };
    this.teachers.update(list => [newTeacher, ...list.filter(t => t.id !== id)]);
    try { setDoc(doc(this.db, 'teachers', id), newTeacher); } catch (e) { }
    return newTeacher;
  }

  updateTeacher(id: string, updated: Partial<Teacher>) {
    this.teachers.update(list => list.map(t => t.id === id ? { ...t, ...updated } : t));
    try { updateDoc(doc(this.db, 'teachers', id), updated as any); } catch (e) { }
  }

  deleteTeacher(id: string) {
    this.teachers.update(list => list.filter(t => t.id !== id));
    try { deleteDoc(doc(this.db, 'teachers', id)); } catch (e) { }
  }

  // CRUD Helpers for Classes
  addClass(item: ClassModel) {
    const id = item.id || 'cls-' + Date.now();
    const newClass = { ...item, id };
    this.classes.update(list => [...list.filter(c => c.id !== id), newClass]);
    try { setDoc(doc(this.db, 'classes', id), newClass); } catch (e) { }
    return newClass;
  }

  deleteClass(id: string) {
    this.classes.update(list => list.filter(c => c.id !== id));
    try { deleteDoc(doc(this.db, 'classes', id)); } catch (e) { }
  }

  // Attendance CRUD
  markAttendance(records: AttendanceRecord[]) {
    this.attendanceRecords.update(existing => {
      const filtered = existing.filter(e => !records.some(r => r.studentId === e.studentId && r.date === e.date));
      return [...records, ...filtered];
    });
    records.forEach(r => {
      const id = r.id || 'att-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
      const rec = { ...r, id };
      try { setDoc(doc(this.db, 'attendance', id), rec); } catch (e) { }
    });
  }

  // Exam & Mark CRUD
  addExam(exam: Exam) {
    const id = exam.id || 'ex-' + Date.now();
    const newExam = { ...exam, id };
    this.exams.update(list => [newExam, ...list.filter(e => e.id !== id)]);
    try { setDoc(doc(this.db, 'exams', id), newExam); } catch (e) { }
    return newExam;
  }

  saveMarks(marks: MarkRecord[]) {
    this.marksRecords.update(existing => {
      const filtered = existing.filter(e => !marks.some(m => m.examId === e.examId && m.studentId === e.studentId && m.subjectName === e.subjectName));
      return [...marks, ...filtered];
    });
    marks.forEach(m => {
      const id = m.id || 'mrk-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
      const rec = { ...m, id };
      try { setDoc(doc(this.db, 'marks', id), rec); } catch (e) { }
    });
  }

  // Fee CRUD
  addFeeRecord(fee: FeeRecord) {
    const id = fee.id || 'fee-' + Date.now();
    const newFee = { ...fee, id };
    this.feeRecords.update(list => [newFee, ...list.filter(f => f.id !== id)]);
    try { setDoc(doc(this.db, 'fees', id), newFee); } catch (e) { }
    return newFee;
  }

  updateFeePayment(id: string, paidAmount: number, paymentDate: string, transactionRef?: string) {
    this.feeRecords.update(list => list.map(f => {
      if (f.id === id) {
        const totalPaid = f.paidAmount + paidAmount;
        const dueAmount = Math.max(0, f.amount - totalPaid);
        const status: 'Paid' | 'Partial' = dueAmount === 0 ? 'Paid' : 'Partial';
        const updated: FeeRecord = { ...f, paidAmount: totalPaid, dueAmount, status, paymentDate, transactionRef };
        try { updateDoc(doc(this.db, 'fees', id), updated as any); } catch (e) { }
        return updated;
      }
      return f;
    }));
  }

  // Notice CRUD
  addNotice(notice: Notice) {
    const id = notice.id || 'ntc-' + Date.now();
    const newNotice = { ...notice, id };
    this.notices.update(list => [newNotice, ...list.filter(n => n.id !== id)]);
    try { setDoc(doc(this.db, 'notices', id), newNotice); } catch (e) { }
    return newNotice;
  }

  deleteNotice(id: string) {
    this.notices.update(list => list.filter(n => n.id !== id));
    try { deleteDoc(doc(this.db, 'notices', id)); } catch (e) { }
  }

  // Timetable CRUD
  addTimetableEntry(entry: TimetableEntry) {
    const id = entry.id || 'tt-' + Date.now();
    const newEntry = { ...entry, id };
    this.timetables.update(list => [...list.filter(t => t.id !== id), newEntry]);
    try { setDoc(doc(this.db, 'timetable', id), newEntry); } catch (e) { }
    return newEntry;
  }

  deleteTimetableEntry(id: string) {
    this.timetables.update(list => list.filter(t => t.id !== id));
    try { deleteDoc(doc(this.db, 'timetable', id)); } catch (e) { }
  }

  // Settings
  updateSettings(settings: SchoolSettings) {
    this.schoolSettings.set(settings);
    try { setDoc(doc(this.db, 'settings', 'school'), settings); } catch (e) { }
  }
}
