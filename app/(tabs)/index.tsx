import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#f8e8ef', dark: '#2d1f2f' }}
      headerImage={
        <Image
          source={require('@/assets/images/robe2.png')}
          style={styles.heroImage}
          contentFit="cover"
        />
      }>
      <ThemedView style={styles.heroContainer}>
        <View style={styles.heroBadge}>
          <ThemedText type="defaultSemiBold">Nouvelle collection</ThemedText>
        </View>
        <ThemedText type="title">Bienvenue dans votre boutique de robes</ThemedText>
        <ThemedText style={styles.heroDescription}>
          Découvrez nos modèles tendance, parcourez le catalogue et trouvez la robe parfaite pour votre prochaine sortie.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.actionContainer}>
        <Link href="/catalogue" asChild>
          <Pressable style={styles.mainButton}>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              Voir le catalogue
            </ThemedText>
          </Pressable>
        </Link>

        <Link href="/explore" asChild>
          <Pressable style={styles.secondaryButton}>
            <ThemedText type="defaultSemiBold" style={styles.secondaryButtonText}>
              En savoir plus
            </ThemedText>
          </Pressable>
        </Link>
      </ThemedView>

      <ThemedView style={styles.featuresContainer}>
        <ThemedView style={styles.featureCard}>
          <ThemedText type="subtitle">Catalogue</ThemedText>
          <ThemedText>Plus de 20 robes disponibles pour toutes les occasions.</ThemedText>
        </ThemedView>
        <ThemedView style={styles.featureCard}>
          <ThemedText type="subtitle">Produit détaillé</ThemedText>
          <ThemedText>Une page dédiée pour chaque robe avec photos et description.</ThemedText>
        </ThemedView>
        <ThemedView style={styles.featureCard}>
          <ThemedText type="subtitle">Shopping simple</ThemedText>
          <ThemedText>Navigation fluide entre l’accueil, le catalogue et les détails.</ThemedText>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  heroImage: {
    width: '100%',
    height: 260,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  heroContainer: {
    minHeight: 280,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff2f9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginBottom: 12,
  },
  heroDescription: {
    marginTop: 12,
    lineHeight: 22,
    maxWidth: '85%',
  },
  actionContainer: {
    gap: 12,
    marginTop: 16,
    paddingHorizontal: 20,
  },
  mainButton: {
    backgroundColor: '#d6336c',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#f5f5f8',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
  },
  secondaryButtonText: {
    color: '#47243c',
  },
  featuresContainer: {
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 24,
    paddingBottom: 24,
  },
  featureCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#f0e4ed',
  },
});
