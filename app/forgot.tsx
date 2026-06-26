import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Image, Keyboard, Animated, Platform } from 'react-native';
import { TextInput, Button, Text, HelperText, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { resetPassword } from '@/services/auth';

// Validation helper
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValidEmail = (email: string) => emailRegex.test(email);

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
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
    setShowBanner(false);
    try {
      await resetPassword(email);
      setIsError(false);
      setBannerMessage('Un e‑mail de réinitialisation a été envoyé !');
      setShowBanner(true);
    } catch (e: any) {
      setIsError(true);
      setBannerMessage(e.message ?? "Erreur lors de la demande");
      setShowBanner(true);
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = isValidEmail(email);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateX: shakeAnim }] }]}>
      {/* Hero image */}
      <View style={styles.imageWrapper}>
        <Image
          source={require('../assets/auth-hero.jpg')}
          style={styles.image}
          resizeMode="cover"
          accessibilityLabel="Mode fashion"
        />
      </View>

      {/* Form */}
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
          left={<TextInput.Icon icon={() => <MaterialCommunityIcons name="email" size={20} />} />}
          outlineColor={email ? '#111' : '#ccc'}
          activeOutlineColor="#111"
        />
        <HelperText type="error" visible={email !== '' && !isValidEmail(email)}>
          Adresse e‑mail invalide
        </HelperText>

        <Button
          mode="contained"
          onPress={handleSubmit}
          disabled={!isFormValid || loading}
          style={styles.submitButton}
          contentStyle={styles.submitContent}
        >
          {loading ? <ActivityIndicator animating color="white" /> : 'Envoyer le lien'}
        </Button>

        <View style={styles.linksRow}>
          <Text style={styles.link} onPress={() => router.push('/auth')}>
            Retour à la connexion
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

/* ------------------------------------------------------ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EFE6',
  },
  imageWrapper: {
    flex: 1,
    maxHeight: Platform.OS === 'web' ? '100%' : 250,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  formWrapper: {
    flex: 2,
    paddingHorizontal: 32,
    paddingTop: 24,
  },
  input: {
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  submitButton: {
    marginTop: 16,
    borderRadius: 4,
    backgroundColor: '#111',
  },
  submitContent: {
    height: 48,
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  link: {
    color: '#555',
    fontSize: 14,
    textDecorationLine: 'none',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  bannerText: {
    marginLeft: 8,
    fontSize: 14,
  },
});
