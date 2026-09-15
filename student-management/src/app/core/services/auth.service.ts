import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, onAuthStateChanged, connectAuthEmulator, User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private app = initializeApp(environment.firebase);
  private auth = getAuth(this.app);
  private db = getFirestore(this.app);
  public user: User | null = null;

  constructor() {
    if (environment.useEmulator) {
      try {
        connectAuthEmulator(this.auth, 'http://localhost:9099', { disableWarnings: true });
      } catch (e) {
      }
    }
    onAuthStateChanged(this.auth, (u) => (this.user = u));
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  async getUserRole() {
    try {
      if (!this.user) return null;
      const { doc, getDoc, getFirestore } = await import('firebase/firestore');
      const db = getFirestore();
      const d = doc(db, 'users', this.user.uid);
      const snap = await getDoc(d);
      return snap.exists() ? (snap.data() as any).role : null;
    } catch(e) { return null; }
  }
}
