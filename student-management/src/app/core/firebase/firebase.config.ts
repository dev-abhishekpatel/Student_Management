import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { environment } from '../../../environments/environment';

let app: FirebaseApp;
if (!getApps().length) {
  const config = {
    apiKey: environment.firebase?.apiKey || 'demo-api-key',
    authDomain: environment.firebase?.authDomain || 'demo-student-management.firebaseapp.com',
    projectId: environment.firebase?.projectId || 'demo-student-management',
    storageBucket: environment.firebase?.storageBucket || 'demo-student-management.appspot.com',
    messagingSenderId: environment.firebase?.messagingSenderId || '000000000000',
    appId: environment.firebase?.appId || 'demo-app-id'
  };
  app = initializeApp(config);
} else {
  app = getApp();
}

let auth: Auth;
try {
  auth = getAuth(app);
} catch (e) {
  console.warn('Firebase Auth initialization warning:', e);
  auth = {} as Auth;
}

let db: Firestore;
try {
  db = getFirestore(app);
} catch (e) {
  console.warn('Firebase Firestore initialization warning:', e);
  db = {} as Firestore;
}

let storage: FirebaseStorage;
try {
  storage = getStorage(app);
} catch (e) {
  console.warn('Firebase Storage initialization warning:', e);
  storage = {} as FirebaseStorage;
}

export const firebaseApp = app;
export const firebaseAuth = auth;
export const firebaseDb = db;
export const firebaseStorage = storage;
