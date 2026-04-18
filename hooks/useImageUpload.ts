import { useState } from 'react';
import { uploadImageToCloudinary } from '@/lib/cloudinary/upload';

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);

  async function upload(
    _uid: string,
    _setId: string,
    _cardId: string,
    _side: 'front' | 'back',
    file: File
  ): Promise<string> {
    setUploading(true);
    try {
      return await uploadImageToCloudinary(file);
    } finally {
      setUploading(false);
    }
  }

  return { upload, uploading };
}
