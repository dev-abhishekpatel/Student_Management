import { Injectable, signal, computed } from '@angular/core';
import { 
  signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, 
  signOut, onAuthStateChanged, connectAuthEmulator 
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
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
    name: 'System Admin',
    email: 'admin@school.com',
    role: 'admin',
    active: true,
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  });

  public currentRole = computed<Role>(() => this.currentUser()?.role || 'admin');

  // Registered Accounts Store for Admin Management
  public registeredAccounts = signal<UserProfile[]>([
    {
      uid: 'demo-admin-1',
      name: 'System Admin',
      email: 'admin@school.com',
      role: 'admin',
      active: true,
      status: 'Active',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      createdAt: '2026-01-01'
    },
    {
      uid: 'demo-teacher-1',
      name: 'Dr. Robert D\'Souza',
      email: 'robert@school.com',
      role: 'teacher',
      active: true,
      status: 'Active',
      teacherId: 'tch-1',
      avatarUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150',
      createdAt: '2026-01-05'
    },
    {
      uid: 'demo-student-1',
      name: 'Aarav Patel',
      email: 'aarav.patel@school.com',
      role: 'student',
      active: true,
      status: 'Active',
      studentId: 'st-101',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      createdAt: '2026-02-10'
    },
    {
      uid: 'demo-pending-1',
      name: 'Priya Sharma (Pending Teacher)',
      email: 'priya.sharma@school.com',
      role: 'teacher',
      active: false,
      status: 'Pending',
      avatarUrl: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=f59e0b&color=fff',
      createdAt: '2026-09-16'
    },
    {
      uid: 'demo-pending-2',
      name: 'Rohan Verma (Pending Student)',
      email: 'rohan.v@school.com',
      role: 'student',
      active: false,
      status: 'Pending',
      avatarUrl: 'https://ui-avatars.com/api/?name=Rohan+Verma&background=f59e0b&color=fff',
      createdAt: '2026-09-17'
    }
  ]);

  constructor() {
    if (environment.useEmulator) {
      try {
        connectAuthEmulator(this.auth, 'http://localhost:9099', { disableWarnings: true });
      } catch (e) {}
    }
    onAuthStateChanged(this.auth, async (u) => {
      if (u) {
        const profile = await this.fetchUserProfile(u.uid);
        if (profile) {
          this.currentUser.set(profile);
        } else {
          this.currentUser.set({
            uid: u.uid,
            name: u.displayName || u.email?.split('@')[0] || 'User',
            email: u.email || '',
            role: 'admin',
            active: true,
            status: 'Active'
          });
        }
      }
    });
  }

  // Quick switch role for demo application
  switchDemoRole(role: Role) {
    if (role === 'admin') {
      this.currentUser.set({
        uid: 'demo-admin-1',
        name: 'System Admin',
        email: 'admin@school.com',
        role: 'admin',
        active: true,
        status: 'Active',
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
        status: 'Active',
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
        status: 'Active',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      });
    }
  }

  async login(email: string, pass: string, targetRole?: Role) {
    const lowerEmail = email.toLowerCase().trim();

    // Check existing registered account status
    const existing = this.registeredAccounts().find(a => a.email.toLowerCase() === lowerEmail);

    if (existing && !existing.active) {
      throw new Error(`Your account (${existing.email}) is pending administrator activation. Please contact school administration to activate your access.`);
    }

    try {
      const res = await signInWithEmailAndPassword(this.auth, email, pass);
      const role = targetRole || (existing?.role) || await this.fetchUserRole(res.user.uid) || 'admin';

      const userProfile: UserProfile = {
        uid: res.user.uid,
        name: res.user.displayName || email.split('@')[0],
        email: res.user.email || email,
        role: role,
        studentId: role === 'student' ? 'st-101' : undefined,
        teacherId: role === 'teacher' ? 'tch-1' : undefined,
        active: existing ? existing.active : true,
        status: existing ? existing.status : 'Active'
      };

      if (!userProfile.active) {
        throw new Error('Account inactive. Contact admin.');
      }

      this.currentUser.set(userProfile);
      return res;
    } catch(err: any) {
      if (err.message && err.message.includes('pending administrator activation')) {
        throw err;
      }
      
      // Fallback for demo login if firebase auth fails / demo user
      if (existing) {
        if (!existing.active) {
          throw new Error(`Your account (${existing.email}) is pending administrator activation. Please contact school administration.`);
        }
        this.currentUser.set(existing);
        return true;
      }

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
    const today = new Date().toISOString().split('T')[0];
    
    // New accounts registered by default have active = false (pending Admin Approval)
    const isFirstAdmin = role === 'admin' && this.registeredAccounts().filter(a => a.role === 'admin').length === 0;
    const initialActive = isFirstAdmin; // Only if first admin, auto-activate; otherwise require Admin Approval

    let uid = 'usr-' + Date.now();

    try {
      const res = await createUserWithEmailAndPassword(this.auth, email, pass);
      if (res.user) {
        uid = res.user.uid;
        await updateProfile(res.user, { displayName: name });
        try {
          await setDoc(doc(this.db, 'users', uid), {
            name,
            email,
            role,
            active: initialActive,
            status: initialActive ? 'Active' : 'Pending',
            createdAt: today
          });
        } catch(e){}
      }
    } catch(err: any) {
      // Demo fallback uid
    }

    const newProfile: UserProfile = {
      uid: uid,
      name,
      email,
      role,
      active: initialActive,
      status: initialActive ? 'Active' : 'Pending',
      studentId: role === 'student' ? (details?.studentId || 'st-' + Date.now()) : undefined,
      teacherId: role === 'teacher' ? (details?.teacherId || 'tch-' + Date.now()) : undefined,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${initialActive ? '10b981' : 'f59e0b'}&color=fff`,
      createdAt: today
    };

    // Store in registered accounts signal list
    this.registeredAccounts.update(list => [newProfile, ...list.filter(u => u.email !== email)]);

    if (initialActive) {
      this.currentUser.set(newProfile);
    }
    return newProfile;
  }

  // Admin Account Activation Permissions & Management
  toggleAccountStatus(uid: string, active: boolean) {
    this.registeredAccounts.update(list => list.map(acc => {
      if (acc.uid === uid) {
        const updatedStatus = active ? 'Active' : 'Inactive';
        const updated = { ...acc, active, status: updatedStatus as 'Active' | 'Inactive' };
        try {
          updateDoc(doc(this.db, 'users', uid), { active, status: updatedStatus });
        } catch(e){}
        return updated;
      }
      return acc;
    }));
  }

  approveAccount(uid: string) {
    this.toggleAccountStatus(uid, true);
  }

  updateAccountRole(uid: string, role: Role) {
    this.registeredAccounts.update(list => list.map(acc => {
      if (acc.uid === uid) {
        const updated = { ...acc, role };
        try {
          updateDoc(doc(this.db, 'users', uid), { role });
        } catch(e){}
        return updated;
      }
      return acc;
    }));
  }

  deleteAccount(uid: string) {
    this.registeredAccounts.update(list => list.filter(acc => acc.uid !== uid));
    try {
      deleteDoc(doc(this.db, 'users', uid));
    } catch(e){}
  }

  logout() {
    this.currentUser.set(null);
    return signOut(this.auth).catch(() => {});
  }

  private async fetchUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const snap = await getDoc(doc(this.db, 'users', uid));
      if (snap.exists()) {
        const d = snap.data();
        return {
          uid,
          name: d['name'],
          email: d['email'],
          role: d['role'],
          active: d['active'] ?? true,
          status: d['status'] || 'Active',
          createdAt: d['createdAt']
        };
      }
      return null;
    } catch(e) {
      return null;
    }
  }

  private async fetchUserRole(uid: string): Promise<Role | null> {
    const prof = await this.fetchUserProfile(uid);
    return prof ? prof.role : null;
  }
}
