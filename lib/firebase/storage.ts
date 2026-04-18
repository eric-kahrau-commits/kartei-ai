import { ref, uploadBytes, getDownloadURL, deleteObject, getStorage } from 'firebase/storage';
import { getFirebaseApp } from './config';

function storage() {
  return getStorage(getFirebaseApp());
}

async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const MAX_WIDTH = 1200;
      const scale = img.width > MAX_WIDTH ? MAX_WIDTH / img.width : 1;
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Compression failed'))),
        'image/jpeg',
        0.85
      );
    };
    img.onerror = reject;
    img.src = url;
  });
}

export async function uploadCardImage(
  uid: string,
  setId: string,
  cardId: string,
  side: 'front' | 'back',
  file: File
): Promise<string> {
  const blob = await compressImage(file);
  const path = `users/${uid}/sets/${setId}/cards/${cardId}_${side}.jpg`;
  const storageRef = ref(storage(), path);
  await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' });
  return getDownloadURL(storageRef);
}

export async function deleteCardImage(url: string) {
  try {
    const storageRef = ref(storage(), url);
    await deleteObject(storageRef);
  } catch {
    // ignore if already deleted
  }
}
