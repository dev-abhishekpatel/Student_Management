import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, getDocs, onSnapshot, query, where, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private app = initializeApp(environment.firebase);
  private db = getFirestore(this.app);
  private storage = getStorage(this.app);

  constructor() {
    if (environment.useEmulator) {
      try {
        // connect firestore/storage emulators if available
        // @ts-ignore
        import('firebase/firestore').then(({ connectFirestoreEmulator }) => {
          try { connectFirestoreEmulator(this.db, 'localhost', 8080); } catch(e){}
        });
        // @ts-ignore
        import('firebase/storage').then(({ connectStorageEmulator }) => {
          try { connectStorageEmulator(this.storage, 'localhost', 9199); } catch(e){}
        });
      } catch (e) {}
    }
  }

  collectionRef() {
    return collection(this.db, 'students');
  }

  async addStudent(data: any) {
    return addDoc(this.collectionRef(), { ...data, createdAt: new Date() });
  }

  async updateStudent(id: string, data: any) {
    const d = doc(this.db, 'students', id);
    return updateDoc(d, data);
  }

  async deleteStudent(id: string) {
    return deleteDoc(doc(this.db, 'students', id));
  }

  async getStudent(id: string) {
    const d = doc(this.db, "students", id);
    const { getDoc } = await import("firebase/firestore");
    const snap = await getDoc(d);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  }

  async listStudents() {
    const q = query(this.collectionRef());
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  async uploadPhoto(file: File, path: string) {
    const storageRef = ref(this.storage, path);
    const snap = await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  listenStudents(callback: (items:any[])=>void) {
    return onSnapshot(query(this.collectionRef()), (snap:any)=>{
      callback(snap.docs.map((d:any)=>({ id: d.id, ...d.data() })));
    });
  }

}

