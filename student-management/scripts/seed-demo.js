/**
 * Demo seeding script for local Firebase Emulators
 *
 * Usage:
 * 1. Install firebase-tools and start emulators: `firebase emulators:start`
 * 2. Run this script with Node.js. It uses the Firebase Admin SDK and assumes
 *    you have a service account JSON at `scripts/serviceAccount.json` or that
 *    the environment is already configured for the Admin SDK.
 *
 * NOTE: This script is safe for emulator use only. Do not run against production
 * projects unless you understand the effects.
 */

const admin = require('firebase-admin');
const fs = require('fs');

const svcPath = 'scripts/serviceAccount.json';
if (fs.existsSync(svcPath)) {
  admin.initializeApp({ credential: admin.credential.cert(require(`./serviceAccount.json`)) });
} else {
  admin.initializeApp(); // will work against emulators if GOOGLE_APPLICATION_CREDENTIALS is set
}

const auth = admin.auth();
const db = admin.firestore();

async function seed() {
  console.log('Seeding demo users and students...');
  // create demo users
  const users = [
    { email: 'admin@example.com', password: 'password', role: 'admin' },
    { email: 'teacher@example.com', password: 'password', role: 'teacher' },
    { email: 'student@example.com', password: 'password', role: 'student' }
  ];

  for (const u of users) {
    try {
      const user = await auth.createUser({ email: u.email, password: u.password });
      await db.collection('users').doc(user.uid).set({ email: u.email, role: u.role, createdAt: admin.firestore.FieldValue.serverTimestamp() });
      console.log('Created user', u.email);
    } catch (e) {
      console.log('User create skipped', u.email, e.message || e.code);
    }
  }

  // create sample students
  const students = [
    { name: 'Alice Kumar', email: 'alice@example.com', classId: '10-A' },
    { name: 'Bob Singh', email: 'bob@example.com', classId: '10-A' },
    { name: 'Carol Das', email: 'carol@example.com', classId: '9-B' }
  ];
  for (const s of students) {
    await db.collection('students').add({ ...s, createdAt: admin.firestore.FieldValue.serverTimestamp() });
  }

  console.log('Seeding complete');
}

seed().catch(err => { console.error(err); process.exit(1); });
