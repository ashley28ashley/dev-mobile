import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Keyboard, Animated, Platform } from 'react-native';
import { TextInput, Button, Text, HelperText, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signUp } from '@/services/auth';
import { isValidEmail, isStrongPassword } from '@/services/validation';

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    setLoading(true);
    setErrorMsg('');
    setShowBanner(false);
    try {
      await signUp(email, password);
      router.replace('/catalogue'); // redirect to catalogue after successful sign‑up
    } catch (e: any) {
      setIsError(true);
      setBannerMessage(e.message ?? 'Erreur lors de l’inscription');
      setShowBanner(true);
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = password === confirmPassword && password !== '';
  const isFormValid = isValidEmail(email) && isStrongPassword(password) && passwordsMatch;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateX: shakeAnim }] }]}>
      <View style={styles.imageWrapper}>
        <Image
          source={require('../assets/auth-hero.jpg')}
          style={styles.image}
          resizeMode="cover"
          accessibilityLabel="Mode fashion"
        />
      </View>

      <View style={styles.formWrapper}>
        {showBanner && (
          <View style={[styles.banner, { backgroundColor: isError ? '#FFEBEE' : '#E8F5E9' }]} accessibilityRole="alert">
            <MaterialCommunityIcons name={isError ? 'alert-circle' : 'check-circle'} size={20} color={isError ? '#D32F2F' : '#388E3C'} />
            <Text style={[styles.bannerText, { color: isError ? '#D32F2F' : '#388E3C' }]}>{bannerMessage}</Text>
          </View>
        )}
        <TextInput
          label="Email"
          placeholder="email@exemple.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          mode="outlined"
          left={<TextInput.Icon icon="email" size={20} />}
          outlineColor={email ? '#111' : '#ccc'}
          activeOutlineColor="#111"
        />
        <HelperText type="error" visible={email !== '' && !isValidEmail(email)}>
          Adresse e‑mail invalide
        </HelperText>

        <TextInput
          label="Mot de passe"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.input}
          mode="outlined"
          left={<TextInput.Icon icon="lock" size={20} />}
          right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} size={20} onPress={() => setShowPassword(!showPassword)} />}
          outlineColor={password ? '#111' : '#ccc'}
          activeOutlineColor="#111"
        />
        <HelperText type="error" visible={password !== '' && !isStrongPassword(password)}>
          Le mot de passe doit contenir au moins 8 caractères
        </HelperText>

        <TextInput
          label="Confirmer le mot de passe"
          placeholder="••••••••"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showPassword}
          style={styles.input}
          mode="outlined"
          left={<TextInput.Icon icon="lock-check" size={20} />}
          outlineColor={confirmPassword ? '#111' : '#ccc'}
          activeOutlineColor="#111"
        />
        <HelperText type="error" visible={!passwordsMatch && confirmPassword !== ''}>
          Les mots de passe ne correspondent pas
        </HelperText>

        <Button
          mode="contained"
          onPress={handleSubmit}
          disabled={!isFormValid || loading}
          style={styles.submitButton}
          contentStyle={styles.submitContent}
        >
          {loading ? <ActivityIndicator animating color="white" /> : 'Créer mon compte'}
        </Button>

        <View style={styles.linksRow}>
          <Text style={styles.link} onPress={() => router.push('/login')}>Déjà un compte ? Se connecter</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5EFE6' },
  imageWrapper: { flex: 1, maxHeight: Platform.OS === 'web' ? '100%' : 250 },
  image: { width: '100%', height: '100%' },
  formWrapper: { flex: 2, paddingHorizontal: 32, paddingTop: 24 },
  input: { marginBottom: 8, backgroundColor: '#fff' },
  submitButton: { marginTop: 16, borderRadius: 4, backgroundColor: '#111' },
  submitContent: { height: 48 },
  linksRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
  link: { color: '#555', fontSize: 14, textDecorationLine: 'none' },
  banner: { flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 4, marginBottom: 8 },
  bannerText: { marginLeft: 8, fontSize: 14 },
});
