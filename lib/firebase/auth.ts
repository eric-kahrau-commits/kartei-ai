import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  getAuth,
} from 'firebase/auth';
import { getFirebaseApp } from './config';

function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}

function setAuthCookie() {
  document.cookie = 'auth_session=1; path=/; max-age=604800; SameSite=Lax';
}

function clearAuthCookie() {
  document.cookie = 'auth_session=; path=/; max-age=0';
}

export async function signUp(email: string, password: string, displayName?: string) {
  const auth = getFirebaseAuth();
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(credential.user, { displayName });
  }
  setAuthCookie();
  return credential.user;
}

export async function signIn(email: string, password: string) {
  const auth = getFirebaseAuth();
  const credential = await signInWithEmailAndPassword(auth, email, password);
  setAuthCookie();
  return credential.user;
}

export async function signOut() {
  const auth = getFirebaseAuth();
  await firebaseSignOut(auth);
  clearAuthCookie();
}
