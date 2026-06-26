import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { type Product, getProduct } from '@/services/api';
import { useCartStore } from '../../store/useCartStore';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await getProduct(id);
    if (error || !data) {
      setError('Produit introuvable.');
    } else {
      setProduct(data);
    }
    setLoading(false);
  };

  const handleAddToCart = () => {
    if (!product) {
      console.log('product est null, abandon');
      return;
    }
    console.log('handleAddToCart appelé', product);
    addToCart({
      id: product.id,
      nom: product.name,
      prix: product.price,
      image_url: product.image_url,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // État loading
  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color="#0a7ea4" />
        <ThemedText style={styles.statusText}>Chargement...</ThemedText>
      </ThemedView>
    );
  }

  // État error
  if (error || !product) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.errorText}>{error ?? 'Produit introuvable.'}</ThemedText>
        <Pressable style={styles.retryBtn} onPress={fetchProduct}>
          <ThemedText style={styles.retryText}>Réessayer</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol size={24} name="chevron.left" color="#0a7ea4" />
          <ThemedText style={styles.backText}>Retour</ThemedText>
        </Pressable>
      </ThemedView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image_url }}
            style={styles.detailImage}
            contentFit="contain"
          />
        </View>

        {/* Infos */}
        <ThemedView style={styles.detailsContainer}>
          <ThemedText type="title">{product.name}</ThemedText>

          <ThemedView style={styles.priceContainer}>
            <ThemedText style={styles.price}>{product.price.toFixed(2)} €</ThemedText>
          </ThemedView>

          {product.description && (
            <ThemedView style={styles.descriptionContainer}>
              <ThemedText type="subtitle">Description</ThemedText>
              <ThemedText style={styles.description}>{product.description}</ThemedText>
            </ThemedView>
          )}

          {/* Bouton panier */}
          <Pressable
            style={[styles.button, added && styles.buttonAdded]}
            onPress={handleAddToCart}
          >
            <Text style={styles.buttonText}>
              {added ? '✓ Ajouté au panier !' : 'Ajouter au panier'}
            </Text>
          </Pressable>

          {/* Lien vers le panier */}
          {added && (
            <Pressable style={styles.cartLink} onPress={() => router.push('/(tabs)/cart')}>
              <Text style={styles.cartLinkText}>Voir mon panier →</Text>
            </Pressable>
          )}
        </ThemedView>
      </ScrollView >
    </ThemedView >
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 32,
  },
  statusText: { color: '#888', fontSize: 15 },
  errorText: { color: '#e53935', fontSize: 15, textAlign: 'center' },
  retryBtn: {
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: { color: '#fff', fontWeight: 'bold' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5ea',
  },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backText: { fontSize: 16, color: '#0a7ea4' },
  content: { flex: 1, padding: 16 },
  imageContainer: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  detailImage: { width: '100%', height: '100%' },
  detailsContainer: { gap: 20, paddingBottom: 40 },
  priceContainer: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  price: { color: '#0a7ea4', fontWeight: 'bold', fontSize: 22 },
  descriptionContainer: { gap: 8 },
  description: { lineHeight: 22, color: '#555', marginTop: 4 },
  button: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonAdded: { backgroundColor: '#2e7d32' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cartLink: { alignItems: 'center', paddingVertical: 4 },
  cartLinkText: { color: '#0a7ea4', fontSize: 14 },
});
