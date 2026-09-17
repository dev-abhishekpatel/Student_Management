import { Injectable, signal } from '@angular/core';
import { 
  collection, addDoc, doc, updateDoc, deleteDoc, getDocs, 
  query, where, onSnapshot, getDoc, setDoc, orderBy 
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

  // In-memory fallback stores populated with rich sample data for immediate demo operation
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
    },
    {
      id: 'st-102',
      studentId: 'STD-2026-002',
      name: 'Ananya Sharma',
      email: 'ananya.sharma@school.com',
      phone: '+91 9876543212',
      gender: 'Female',
      dob: '2010-08-22',
      classId: 'Class 10-A',
      sectionId: 'A',
      rollNumber: '102',
      address: '15 Nehru Nagar, Block B, City',
      parent: { fatherName: 'Vikram Sharma', motherName: 'Meera Sharma', phone: '+91 9876543213' },
      photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      status: 'Active'
    },
    {
      id: 'st-103',
      studentId: 'STD-2026-003',
      name: 'Rohan Gupta',
      email: 'rohan.gupta@school.com',
      phone: '+91 9876543214',
      gender: 'Male',
      dob: '2011-01-10',
      classId: 'Class 9-B',
      sectionId: 'B',
      rollNumber: '201',
      address: '88 Park Street, Apt 4C, City',
      parent: { fatherName: 'Sanjay Gupta', motherName: 'Kavita Gupta', phone: '+91 9876543215' },
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      status: 'Active'
    },
    {
      id: 'st-104',
      studentId: 'STD-2026-004',
      name: 'Diya Verma',
      email: 'diya.verma@school.com',
      phone: '+91 9876543216',
      gender: 'Female',
      dob: '2010-11-05',
      classId: 'Class 10-B',
      sectionId: 'B',
      rollNumber: '103',
      address: '102 Lake View, Green Colony, City',
      parent: { fatherName: 'Amit Verma', motherName: 'Pooja Verma', phone: '+91 9876543217' },
      photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      status: 'Active'
    },
    {
      id: 'st-105',
      studentId: 'STD-2026-005',
      name: 'Kabir Mehta',
      email: 'kabir.mehta@school.com',
      phone: '+91 9876543218',
      gender: 'Male',
      dob: '2009-12-19',
      classId: 'Class 11-A',
      sectionId: 'A',
      rollNumber: '301',
      address: '77 Civil Lines, City',
      parent: { fatherName: 'Raman Mehta', motherName: 'Anita Mehta', phone: '+91 9876543219' },
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
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
    },
    {
      id: 'tch-2',
      teacherId: 'TCH-002',
      name: 'Mrs. Priya Banerjee',
      email: 'priya@school.com',
      phone: '+91 9988776656',
      qualification: 'M.Sc in Physics, B.Ed',
      subjects: ['Physics', 'Science'],
      classIds: ['Class 9-B', 'Class 10-A'],
      isClassTeacher: true,
      assignedClassId: 'Class 9-B',
      status: 'Active'
    },
    {
      id: 'tch-3',
      teacherId: 'TCH-003',
      name: 'Mr. David Miller',
      email: 'david@school.com',
      phone: '+91 9988776657',
      qualification: 'M.A in English Literature',
      subjects: ['English', 'Literature'],
      classIds: ['Class 10-A', 'Class 10-B', 'Class 11-A'],
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
    },
    {
      id: 'cls-2',
      name: 'Class 10-B',
      section: 'B',
      academicYear: '2025-2026',
      classTeacherId: 'tch-3',
      classTeacherName: 'Mr. David Miller',
      subjects: ['Mathematics', 'Physics', 'Biology', 'English', 'Social Studies'],
      capacity: 38
    },
    {
      id: 'cls-3',
      name: 'Class 9-B',
      section: 'B',
      academicYear: '2025-2026',
      classTeacherId: 'tch-2',
      classTeacherName: 'Mrs. Priya Banerjee',
      subjects: ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi'],
      capacity: 35
    },
    {
      id: 'cls-4',
      name: 'Class 11-A',
      section: 'A',
      academicYear: '2025-2026',
      subjects: ['Higher Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science'],
      capacity: 30
    }
  ]);

  public attendanceRecords = signal<AttendanceRecord[]>([
    { id: 'att-1', studentId: 'st-101', studentName: 'Aarav Patel', rollNumber: '101', classId: 'Class 10-A', date: '2026-09-15', status: 'Present', markedBy: 'Dr. Robert D\'Souza' },
    { id: 'att-2', studentId: 'st-102', studentName: 'Ananya Sharma', rollNumber: '102', classId: 'Class 10-A', date: '2026-09-15', status: 'Present', markedBy: 'Dr. Robert D\'Souza' },
    { id: 'att-3', studentId: 'st-104', studentName: 'Diya Verma', rollNumber: '103', classId: 'Class 10-B', date: '2026-09-15', status: 'Late', remarks: 'Bus delay', markedBy: 'Mr. David Miller' },
    { id: 'att-4', studentId: 'st-103', studentName: 'Rohan Gupta', rollNumber: '201', classId: 'Class 9-B', date: '2026-09-15', status: 'Absent', remarks: 'Sick leave requested', markedBy: 'Mrs. Priya Banerjee' }
  ]);

  public exams = signal<Exam[]>([
    { id: 'ex-1', name: 'Mid-Term Examinations 2026', academicYear: '2025-2026', startDate: '2026-10-10', endDate: '2026-10-20', classIds: ['Class 10-A', 'Class 10-B'], status: 'Upcoming' },
    { id: 'ex-2', name: 'Unit Assessment I', academicYear: '2025-2026', startDate: '2026-08-01', endDate: '2026-08-05', classIds: ['Class 10-A', 'Class 9-B'], status: 'Published' }
  ]);

  public marksRecords = signal<MarkRecord[]>([
    { id: 'mrk-1', examId: 'ex-2', examName: 'Unit Assessment I', studentId: 'st-101', studentName: 'Aarav Patel', rollNumber: '101', classId: 'Class 10-A', subjectName: 'Mathematics', marksObtained: 94, maxMarks: 100, grade: 'A+', comments: 'Excellent performance' },
    { id: 'mrk-2', examId: 'ex-2', examName: 'Unit Assessment I', studentId: 'st-102', studentName: 'Ananya Sharma', rollNumber: '102', classId: 'Class 10-A', subjectName: 'Mathematics', marksObtained: 88, maxMarks: 100, grade: 'A', comments: 'Very good' },
    { id: 'mrk-3', examId: 'ex-2', examName: 'Unit Assessment I', studentId: 'st-103', studentName: 'Rohan Gupta', rollNumber: '201', classId: 'Class 9-B', subjectName: 'Science', marksObtained: 76, maxMarks: 100, grade: 'B', comments: 'Good effort' }
  ]);

  public feeRecords = signal<FeeRecord[]>([
    { id: 'fee-1', studentId: 'st-101', studentName: 'Aarav Patel', classId: 'Class 10-A', feeType: 'Tuition Fee', amount: 15000, paidAmount: 15000, dueAmount: 0, dueDate: '2026-09-01', status: 'Paid', paymentDate: '2026-08-28', transactionRef: 'TXN-99881' },
    { id: 'fee-2', studentId: 'st-102', studentName: 'Ananya Sharma', classId: 'Class 10-A', feeType: 'Tuition Fee', amount: 15000, paidAmount: 10000, dueAmount: 5000, dueDate: '2026-09-10', status: 'Partial', paymentDate: '2026-09-05', transactionRef: 'TXN-99882' },
    { id: 'fee-3', studentId: 'st-103', studentName: 'Rohan Gupta', classId: 'Class 9-B', feeType: 'Tuition Fee', amount: 14000, paidAmount: 0, dueAmount: 14000, dueDate: '2026-09-01', status: 'Overdue' },
    { id: 'fee-4', studentId: 'st-104', studentName: 'Diya Verma', classId: 'Class 10-B', feeType: 'Annual Fee', amount: 8000, paidAmount: 8000, dueAmount: 0, dueDate: '2026-08-15', status: 'Paid', paymentDate: '2026-08-10', transactionRef: 'TXN-99883' }
  ]);

  public notices = signal<Notice[]>([
    { id: 'ntc-1', title: 'Parent-Teacher Meeting Scheduled', message: 'Annual Parent-Teacher Interaction session scheduled for Saturday from 9:00 AM to 1:00 PM.', category: 'General', targetAudience: 'All', isPinned: true, authorName: 'Principal Office', createdAt: '2026-09-14' },
    { id: 'ntc-2', title: 'Mid-Term Exam Time Table Released', message: 'Mid-term examination schedule has been published under the Exams section.', category: 'Exam', targetAudience: 'Students', isPinned: true, authorName: 'Exam Cell', createdAt: '2026-09-12' },
    { id: 'ntc-3', title: 'Staff Briefing on Science Exhibition', message: 'All science teachers are requested to attend the planning session in Conference Room B.', category: 'Academic', targetAudience: 'Teachers', authorName: 'Vice Principal', createdAt: '2026-09-10' }
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
    { id: 'tt-1', classId: 'Class 10-A', day: 'Monday', period: 1, timeSlot: '08:30 - 09:15 AM', subjectName: 'Mathematics', teacherName: 'Dr. Robert D\'Souza', roomNumber: 'Room 101' },
    { id: 'tt-2', classId: 'Class 10-A', day: 'Monday', period: 2, timeSlot: '09:15 - 10:00 AM', subjectName: 'Physics', teacherName: 'Mrs. Priya Banerjee', roomNumber: 'Physics Lab' },
    { id: 'tt-3', classId: 'Class 10-A', day: 'Monday', period: 3, timeSlot: '10:15 - 11:00 AM', subjectName: 'English', teacherName: 'Mr. David Miller', roomNumber: 'Room 101' },
    { id: 'tt-4', classId: 'Class 10-A', day: 'Tuesday', period: 1, timeSlot: '08:30 - 09:15 AM', subjectName: 'Chemistry', teacherName: 'Dr. Robert D\'Souza', roomNumber: 'Chemistry Lab' },
    { id: 'tt-5', classId: 'Class 10-A', day: 'Tuesday', period: 2, timeSlot: '09:15 - 10:00 AM', subjectName: 'Mathematics', teacherName: 'Dr. Robert D\'Souza', roomNumber: 'Room 101' }
  ]);

  // CRUD Helpers for Students
  addStudent(item: Student) {
    const id = 'st-' + Date.now();
    const newStudent = { ...item, id };
    this.students.update(list => [newStudent, ...list]);
    try { addDoc(collection(this.db, 'students'), newStudent); } catch(e){}
    return newStudent;
  }

  updateStudent(id: string, updated: Partial<Student>) {
    this.students.update(list => list.map(s => s.id === id ? { ...s, ...updated } : s));
    try { updateDoc(doc(this.db, 'students', id), updated as any); } catch(e){}
  }

  deleteStudent(id: string) {
    this.students.update(list => list.filter(s => s.id !== id));
    try { deleteDoc(doc(this.db, 'students', id)); } catch(e){}
  }

  // CRUD Helpers for Teachers
  addTeacher(item: Teacher) {
    const id = 'tch-' + Date.now();
    const newTeacher = { ...item, id };
    this.teachers.update(list => [newTeacher, ...list]);
    try { addDoc(collection(this.db, 'teachers'), newTeacher); } catch(e){}
    return newTeacher;
  }

  updateTeacher(id: string, updated: Partial<Teacher>) {
    this.teachers.update(list => list.map(t => t.id === id ? { ...t, ...updated } : t));
    try { updateDoc(doc(this.db, 'teachers', id), updated as any); } catch(e){}
  }

  deleteTeacher(id: string) {
    this.teachers.update(list => list.filter(t => t.id !== id));
    try { deleteDoc(doc(this.db, 'teachers', id)); } catch(e){}
  }

  // CRUD Helpers for Classes
  addClass(item: ClassModel) {
    const id = 'cls-' + Date.now();
    const newClass = { ...item, id };
    this.classes.update(list => [...list, newClass]);
    try { addDoc(collection(this.db, 'classes'), newClass); } catch(e){}
    return newClass;
  }

  deleteClass(id: string) {
    this.classes.update(list => list.filter(c => c.id !== id));
    try { deleteDoc(doc(this.db, 'classes', id)); } catch(e){}
  }

  // Attendance CRUD
  markAttendance(records: AttendanceRecord[]) {
    this.attendanceRecords.update(existing => {
      const filtered = existing.filter(e => !records.some(r => r.studentId === e.studentId && r.date === e.date));
      return [...records, ...filtered];
    });
    records.forEach(r => {
      try { addDoc(collection(this.db, 'attendance'), r); } catch(e){}
    });
  }

  // Exam & Mark CRUD
  addExam(exam: Exam) {
    const id = 'ex-' + Date.now();
    const newExam = { ...exam, id };
    this.exams.update(list => [newExam, ...list]);
    try { addDoc(collection(this.db, 'exams'), newExam); } catch(e){}
    return newExam;
  }

  saveMarks(marks: MarkRecord[]) {
    this.marksRecords.update(existing => {
      const filtered = existing.filter(e => !marks.some(m => m.examId === e.examId && m.studentId === e.studentId && m.subjectName === e.subjectName));
      return [...marks, ...filtered];
    });
    marks.forEach(m => {
      try { addDoc(collection(this.db, 'marks'), m); } catch(e){}
    });
  }

  // Fee CRUD
  addFeeRecord(fee: FeeRecord) {
    const id = 'fee-' + Date.now();
    const newFee = { ...fee, id };
    this.feeRecords.update(list => [newFee, ...list]);
    try { addDoc(collection(this.db, 'fees'), newFee); } catch(e){}
    return newFee;
  }

  updateFeePayment(id: string, paidAmount: number, paymentDate: string, transactionRef?: string) {
    this.feeRecords.update(list => list.map(f => {
      if (f.id === id) {
        const totalPaid = f.paidAmount + paidAmount;
        const dueAmount = Math.max(0, f.amount - totalPaid);
        const status: 'Paid' | 'Partial' = dueAmount === 0 ? 'Paid' : 'Partial';
        const updated: FeeRecord = { ...f, paidAmount: totalPaid, dueAmount, status, paymentDate, transactionRef };
        try { updateDoc(doc(this.db, 'fees', id), updated as any); } catch(e){}
        return updated;
      }
      return f;
    }));
  }

  // Notice CRUD
  addNotice(notice: Notice) {
    const id = 'ntc-' + Date.now();
    const newNotice = { ...notice, id };
    this.notices.update(list => [newNotice, ...list]);
    try { addDoc(collection(this.db, 'notices'), newNotice); } catch(e){}
    return newNotice;
  }

  deleteNotice(id: string) {
    this.notices.update(list => list.filter(n => n.id !== id));
    try { deleteDoc(doc(this.db, 'notices', id)); } catch(e){}
  }

  // Timetable CRUD
  addTimetableEntry(entry: TimetableEntry) {
    const id = 'tt-' + Date.now();
    const newEntry = { ...entry, id };
    this.timetables.update(list => [...list, newEntry]);
    try { addDoc(collection(this.db, 'timetable'), newEntry); } catch(e){}
    return newEntry;
  }

  deleteTimetableEntry(id: string) {
    this.timetables.update(list => list.filter(t => t.id !== id));
    try { deleteDoc(doc(this.db, 'timetable', id)); } catch(e){}
  }

  // Settings
  updateSettings(settings: SchoolSettings) {
    this.schoolSettings.set(settings);
    try { setDoc(doc(this.db, 'settings', 'school'), settings); } catch(e){}
  }
}
