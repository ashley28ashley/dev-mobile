import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { signOut } from '@/services/auth';
import { supabase } from '@/services/supabase';
import { scheduleReminder } from '@/services/notifications';

export default function ProfileScreen() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [notifSent, setNotifSent] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data?.user?.email ?? null);
    });
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  const handleReminder = async () => {
    await scheduleReminder('N\'oubliez pas de finaliser votre commande ! 🛍️', 5000);
    setNotifSent(true);
    Alert.alert('Rappel planifié', 'Vous recevrez une notification dans 5 secondes.');
    setTimeout(() => setNotifSent(false), 6000);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FDE3F1', dark: '#2A1F2E' }}
      headerImage={
        <View style={styles.headerContent}>
          <IconSymbol
            size={200}
            color="#c35d8f"
            name="person.crop.circle.fill"
            style={styles.headerImage}
          />
          {/* Avatar + email */}
          <View style={styles.headerInfo}>
            <ThemedText style={styles.headerEmail} numberOfLines={1}>
              {email ?? 'Mon compte'}
            </ThemedText>
          </View>
          {/* Bouton déconnexion dans le header */}
          <Pressable style={styles.headerSignOut} onPress={handleSignOut}>
            <IconSymbol size={16} name="rectangle.portrait.and.arrow.right" color="#fff" />
            <ThemedText style={styles.headerSignOutText}>Déconnexion</ThemedText>
          </Pressable>
        </View>
      }>

      <ThemedView style={styles.introContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          Mon profil
        </ThemedText>
        <ThemedText style={styles.introText}>
          Gérez vos informations, vos préférences et suivez vos commandes ici.
        </ThemedText>
      </ThemedView>

      {/* Infos compte */}
      <ThemedView style={styles.cardRow}>
        <ThemedView style={styles.profileCard}>
          <IconSymbol size={28} name="person.fill" color="#c35d8f" />
          <ThemedText type="subtitle" style={styles.cardTitle}>
            {email ?? 'Mon compte'}
          </ThemedText>
          <ThemedText>Client fidèle depuis 2025</ThemedText>
        </ThemedView>

        <ThemedView style={styles.profileCard}>
          <IconSymbol size={28} name="map.fill" color="#c35d8f" />
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Livraison
          </ThemedText>
          <ThemedText>Paris, France</ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Commandes */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Mes commandes récentes</ThemedText>
        <View style={styles.orderItem}>
          <View style={styles.orderIcon}>
            <IconSymbol size={20} name="bag.fill" color="#ffffff" />
          </View>
          <View style={styles.orderText}>
            <ThemedText type="defaultSemiBold">Robe soirée noire</ThemedText>
            <ThemedText>Livraison prévue demain</ThemedText>
          </View>
        </View>
        <View style={styles.orderItem}>
          <View style={styles.orderIcon}>
            <IconSymbol size={20} name="heart.fill" color="#ffffff" />
          </View>
          <View style={styles.orderText}>
            <ThemedText type="defaultSemiBold">Favoris enregistrés</ThemedText>
            <ThemedText>3 robes ajoutées</ThemedText>
          </View>
        </View>
      </ThemedView>

      {/* Notifications */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Notifications</ThemedText>
        <Pressable
          style={[styles.notifButton, notifSent && styles.notifSent]}
          onPress={handleReminder}
          disabled={notifSent}
        >
          <IconSymbol size={18} name="bell.fill" color="#ffffff" style={{ marginRight: 8 }} />
          <ThemedText style={styles.actionText}>
            {notifSent ? '✓ Rappel planifié !' : 'Planifier un rappel commande'}
          </ThemedText>
        </Pressable>
      </ThemedView>

      {/* Actions */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Actions rapides</ThemedText>
        <Link href="/catalogue" asChild>
          <Pressable style={styles.actionButton}>
            <ThemedText style={styles.actionText}>Retour au catalogue</ThemedText>
          </Pressable>
        </Link>
        <Pressable style={styles.signOutButton} onPress={handleSignOut}>
          <ThemedText style={styles.signOutText}>Se déconnecter</ThemedText>
        </Pressable>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerContent: {
    flex: 1,
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  headerImage: {
    position: 'absolute',
    bottom: -90,
    left: -20,
    color: '#c35d8f',
    opacity: 0.4,
  },
  headerInfo: {
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
  headerEmail: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  headerSignOut: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(195, 93, 143, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  headerSignOutText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  introContainer: { marginBottom: 20 },
  introText: { marginTop: 12, lineHeight: 22, maxWidth: '85%' },
  cardRow: { flexDirection: 'row', gap: 12, marginBottom: 18 },
  profileCard: {
    flex: 1, backgroundColor: '#ffffff', borderRadius: 18,
    padding: 16, borderWidth: 1, borderColor: '#f3d9e8', gap: 8,
  },
  cardTitle: { marginTop: 8 },
  section: { gap: 12, marginBottom: 18 },
  orderItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#ffffff', borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: '#f3d9e8',
  },
  orderIcon: {
    width: 42, height: 42, borderRadius: 12,
    backgroundColor: '#c35d8f', justifyContent: 'center', alignItems: 'center',
  },
  orderText: { flex: 1, gap: 4 },
  actionButton: {
    backgroundColor: '#c35d8f', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
    flexDirection: 'row', justifyContent: 'center',
  },
  notifButton: {
    backgroundColor: '#7c3aed', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
    flexDirection: 'row', justifyContent: 'center',
  },
  notifSent: { backgroundColor: '#2e7d32' },
  actionText: { color: '#ffffff', fontWeight: '700' },
  signOutButton: {
    backgroundColor: '#fff', borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', borderWidth: 1, borderColor: '#e53935',
  },
  signOutText: { color: '#e53935', fontWeight: '700' },
});
