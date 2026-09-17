import { Injectable, signal, computed } from '@angular/core';
import { 
  signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, 
  signOut, onAuthStateChanged, connectAuthEmulator 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { environment } from '../../../environments/environment';
import { Role, UserProfile } from '../models/models';
import { firebaseAuth, firebaseDb } from '../firebase/firebase.config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = firebaseAuth;
  private db = firebaseDb;

  // Active user profile signal
  public currentUser = signal<UserProfile | null>({
    uid: 'demo-admin-1',
    name: 'Administrator',
    email: 'admin@school.com',
    role: 'admin',
    active: true,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  });

  public currentRole = computed<Role>(() => this.currentUser()?.role || 'admin');

  constructor() {
    if (environment.useEmulator) {
      try {
        connectAuthEmulator(this.auth, 'http://localhost:9099', { disableWarnings: true });
      } catch (e) {}
    }
    onAuthStateChanged(this.auth, async (u) => {
      if (u) {
        const role = await this.fetchUserRole(u.uid);
        this.currentUser.set({
          uid: u.uid,
          name: u.displayName || u.email?.split('@')[0] || 'User',
          email: u.email || '',
          role: role || 'admin',
          active: true
        });
      }
    });
  }

  // Quick switch role for testing demo application
  switchDemoRole(role: Role) {
    if (role === 'admin') {
      this.currentUser.set({
        uid: 'demo-admin-1',
        name: 'System Admin',
        email: 'admin@school.com',
        role: 'admin',
        active: true,
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
      });
    } else if (role === 'teacher') {
      this.currentUser.set({
        uid: 'demo-teacher-1',
        name: 'Dr. Robert D\'Souza',
        email: 'robert@school.com',
        role: 'teacher',
        teacherId: 'tch-1',
        active: true,
        avatarUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150'
      });
    } else if (role === 'student') {
      this.currentUser.set({
        uid: 'demo-student-1',
        name: 'Aarav Patel',
        email: 'aarav.patel@school.com',
        role: 'student',
        studentId: 'st-101',
        active: true,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      });
    }
  }

  async login(email: string, pass: string, targetRole?: Role) {
    const lowerEmail = email.toLowerCase();
    try {
      const res = await signInWithEmailAndPassword(this.auth, email, pass);
      const role = targetRole || await this.fetchUserRole(res.user.uid) || 'admin';
      this.currentUser.set({
        uid: res.user.uid,
        name: res.user.displayName || email.split('@')[0],
        email: res.user.email || email,
        role: role,
        studentId: role === 'student' ? 'st-101' : undefined,
        teacherId: role === 'teacher' ? 'tch-1' : undefined,
        active: true
      });
      return res;
    } catch(err) {
      // Fallback for demo login if offline/emulator not connected
      if (targetRole === 'student' || lowerEmail.includes('student') || lowerEmail.includes('aarav')) {
        this.switchDemoRole('student');
      } else if (targetRole === 'teacher' || lowerEmail.includes('teacher') || lowerEmail.includes('robert')) {
        this.switchDemoRole('teacher');
      } else {
        this.switchDemoRole('admin');
      }
      return true;
    }
  }

  async register(name: string, email: string, pass: string, role: Role, details?: any) {
    try {
      const res = await createUserWithEmailAndPassword(this.auth, email, pass);
      if (res.user) {
        await updateProfile(res.user, { displayName: name });
        try {
          await setDoc(doc(this.db, 'users', res.user.uid), {
            name,
            email,
            role,
            active: true,
            createdAt: new Date().toISOString()
          });
        } catch(e){}
      }
      
      const newProfile: UserProfile = {
        uid: res.user ? res.user.uid : 'usr-' + Date.now(),
        name,
        email,
        role,
        active: true,
        studentId: role === 'student' ? (details?.studentId || 'st-' + Date.now()) : undefined,
        teacherId: role === 'teacher' ? (details?.teacherId || 'tch-' + Date.now()) : undefined,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
      };
      
      this.currentUser.set(newProfile);
      return newProfile;
    } catch(err: any) {
      const newProfile: UserProfile = {
        uid: 'demo-' + role + '-' + Date.now(),
        name,
        email,
        role,
        active: true,
        studentId: role === 'student' ? 'st-' + Date.now() : undefined,
        teacherId: role === 'teacher' ? 'tch-' + Date.now() : undefined,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
      };
      this.currentUser.set(newProfile);
      return newProfile;
    }
  }

  logout() {
    this.currentUser.set(null);
    return signOut(this.auth).catch(() => {});
  }

  private async fetchUserRole(uid: string): Promise<Role | null> {
    try {
      const snap = await getDoc(doc(this.db, 'users', uid));
      return snap.exists() ? (snap.data() as any).role : null;
    } catch(e) {
      return null;
    }
  }
}
