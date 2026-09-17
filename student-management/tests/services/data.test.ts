import { describe, it, expect } from 'vitest';
import { firebaseApp, firebaseAuth, firebaseDb } from '../../src/app/core/firebase/firebase.config';

describe('Firebase Central Config', () => {
  it('should initialize single firebase app without duplicates', () => {
    expect(firebaseApp).toBeDefined();
    expect(firebaseAuth).toBeDefined();
    expect(firebaseDb).toBeDefined();
  });
});
