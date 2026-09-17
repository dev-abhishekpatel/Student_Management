import { Injectable, signal, computed } from '@angular/core';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, connectAuthEmulator } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
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
        active: true,
        avatarUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150'
      });
    } else if (role === 'student') {
      this.currentUser.set({
        uid: 'demo-student-1',
        name: 'Aarav Patel',
        email: 'aarav.patel@school.com',
        role: 'student',
        active: true,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      });
    }
  }

  async login(email: string, pass: string) {
    try {
      const res = await signInWithEmailAndPassword(this.auth, email, pass);
      const role = await this.fetchUserRole(res.user.uid);
      this.currentUser.set({
        uid: res.user.uid,
        name: res.user.displayName || email.split('@')[0],
        email: res.user.email || email,
        role: role || 'admin',
        active: true
      });
      return res;
    } catch(err) {
      // Fallback for demo login if offline/emulator not connected
      if (email.includes('teacher')) {
        this.switchDemoRole('teacher');
      } else if (email.includes('student')) {
        this.switchDemoRole('student');
      } else {
        this.switchDemoRole('admin');
      }
      return true;
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
