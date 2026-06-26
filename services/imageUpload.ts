import { readAsStringAsync, EncodingType } from 'expo-file-system/legacy';
import { supabase } from './supabase';

export const uploadImage = async (uri: string, fileName: string): Promise<string> => {
  const bucketName = 'product_images';

  const base64 = await readAsStringAsync(uri, {
    encoding: EncodingType.Base64,
  });

  const byteCharacters = atob(base64);
  const byteArray = new Uint8Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteArray[i] = byteCharacters.charCodeAt(i);
  }

  const { data, error } = await supabase
    .storage
    .from(bucketName)
    .upload(fileName, byteArray, {
      contentType: 'image/jpeg',
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error('Image upload failed', error);
    throw error;
  }

  const { data: { publicUrl } } = supabase
    .storage
    .from(bucketName)
    .getPublicUrl(data.path);

  return publicUrl;
};
