import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import { uploadImage } from '@/services/imageUpload';
import { scheduleReminder } from '@/services/notifications';
import { createProduct } from '@/services/api';
import { isAdmin } from '@/services/user';

export default function AddProductScreen() {
  const router = useRouter();
  const [hasPermission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [photoUri, setPhotoUri] = useState<string>('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [admin, setAdmin] = useState<boolean>(false);

  // Vérifier le rôle admin dès le montage
  useEffect(() => {
    (async () => {
      const allowed = await isAdmin();
      setAdmin(allowed);
      if (!allowed) {
        Alert.alert('Accès refusé', 'Seuls les administrateurs peuvent ajouter un produit.');
        router.back();
      }
    })();
  }, []);

  // Demander la permission caméra si nécessaire
  useEffect(() => {
    (async () => {
      if (!hasPermission?.granted) {
        await requestPermission();
      }
    })();
  }, []);

  if (hasPermission?.granted === false) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Permission caméra refusée.</Text>
      </View>
    );
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.7, base64: false });
        setPhotoUri(photo.uri);
      } catch (e) {
        console.error('Erreur prise de photo', e);
      }
    } else {
      console.warn('Camera reference is null');
    }
  };

  const handleSubmit = async () => {
    if (!name || !price) {
      Alert.alert('Erreur', 'Le nom et le prix sont obligatoires.');
      return;
    }
    if (!photoUri) {
      Alert.alert('Erreur', 'Une photo du produit est requise.');
      return;
    }
    try {
      setUploading(true);
      const fileName = `${Date.now()}.jpg`;
      const imageUrl = await uploadImage(photoUri, fileName);
      const { data, error } = await createProduct({
        name,
        price: Number(price),
        image_url: imageUrl,
        description,
      });
      if (error) throw error;
      Alert.alert('Succès', 'Produit créé avec succès');
await scheduleReminder('Produit ajouté ! 🎉', 10000);
      router.push('/(tabs)/catalogue');
    } catch (e: any) {
      console.error(e);
      Alert.alert('Erreur', e.message ?? 'Échec de la création');
    } finally {
      setUploading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.cameraContainer}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.preview} />
        ) : (
          <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
        )}
        <Pressable style={styles.captureBtn} onPress={takePhoto} disabled={uploading}>
          <Text style={styles.captureText}>📸 Prendre la photo</Text>
        </Pressable>
      </View>
      <View style={styles.form}>
        <TextInput placeholder="Nom du produit" value={name} onChangeText={setName} style={styles.input} />
        <TextInput placeholder="Prix" value={price} onChangeText={setPrice} keyboardType="decimal-pad" style={styles.input} />
        <TextInput placeholder="Description (optionnelle)" value={description} onChangeText={setDescription} multiline style={[styles.input, styles.multiline]} />
        <Pressable style={styles.submitBtn} onPress={handleSubmit} disabled={uploading}>
          <Text style={styles.submitText}>{uploading ? 'En cours...' : 'Créer le produit'}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  cameraContainer: { height: 250, backgroundColor: '#000' },
  camera: { flex: 1 },
  preview: { flex: 1, resizeMode: 'cover' },
  captureBtn: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  captureText: { color: '#fff', fontWeight: 'bold' },
  form: { flex: 1, padding: 16, gap: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  multiline: { height: 80, textAlignVertical: 'top' },
  submitBtn: { backgroundColor: '#0a7ea4', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: '#e53935' },
});
