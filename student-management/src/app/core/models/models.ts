export type Role = 'admin' | 'teacher' | 'student';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  active: boolean;
  createdAt?: any;
}

export interface ParentInfo {
  fatherName: string;
  motherName: string;
  phone: string;
  email?: string;
  occupation?: string;
}

export interface Student {
  id?: string;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  classId: string;
  sectionId: string;
  rollNumber: string;
  address: string;
  parent: ParentInfo;
  photoUrl?: string;
  status: 'Active' | 'Inactive' | 'Graduated' | 'Suspended';
  createdAt?: any;
}

export interface Teacher {
  id?: string;
  teacherId: string;
  name: string;
  email: string;
  phone: string;
  qualification: string;
  subjects: string[];
  classIds: string[]; // assigned classes
  isClassTeacher?: boolean;
  assignedClassId?: string;
  photoUrl?: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  createdAt?: any;
}

export interface Subject {
  id?: string;
  code: string;
  name: string;
  classIds: string[];
}

export interface ClassModel {
  id?: string;
  name: string; // e.g. Grade 10
  section: string; // e.g. A
  academicYear: string; // e.g. 2025-2026
  classTeacherId?: string;
  classTeacherName?: string;
  subjects: string[];
  capacity: number;
}

export interface AttendanceRecord {
  id?: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  classId: string;
  date: string; // YYYY-MM-DD
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  remarks?: string;
  markedBy: string;
}

export interface TimetableEntry {
  id?: string;
  classId: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  period: number;
  timeSlot: string; // e.g. "09:00 AM - 09:45 AM"
  subjectName: string;
  teacherName: string;
  roomNumber: string;
}

export interface Exam {
  id?: string;
  name: string; // e.g. Mid-Term 2026
  academicYear: string;
  startDate: string;
  endDate: string;
  classIds: string[];
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Published';
}

export interface MarkRecord {
  id?: string;
  examId: string;
  examName: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  classId: string;
  subjectName: string;
  marksObtained: number;
  maxMarks: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  comments?: string;
}

export interface FeeRecord {
  id?: string;
  studentId: string;
  studentName: string;
  classId: string;
  feeType: 'Tuition Fee' | 'Exam Fee' | 'Library Fee' | 'Transport Fee' | 'Annual Fee';
  amount: number;
  paidAmount: number;
  dueAmount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Partial';
  paymentDate?: string;
  transactionRef?: string;
}

export interface Notice {
  id?: string;
  title: string;
  message: string;
  category: 'General' | 'Academic' | 'Exam' | 'Event' | 'Urgent';
  targetAudience: 'All' | 'Teachers' | 'Students' | 'Parents';
  classId?: string; // Optional class specific
  isPinned?: boolean;
  authorName: string;
  createdAt: string;
}

export interface SchoolSettings {
  schoolName: string;
  code: string;
  academicYear: string;
  email: string;
  phone: string;
  address: string;
  principalName: string;
  themeColor: string;
}
