import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { type Product, listProducts } from '@/services/api';
import { isAdmin } from '@/services/user';


export default function CatalogueScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Check admin role
  useEffect(() => {
    (async () => {
      const admin = await isAdmin();
      setIsAdminUser(admin);
    })();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await listProducts();
    if (error) {
      setError('Impossible de charger les produits.');
    } else {
      setProducts(data ?? []);
    }
    setLoading(false);
  };

  const renderContent = () => {
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
    if (error) {
      return (
        <ThemedView style={styles.centered}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <Pressable style={styles.retryButton} onPress={fetchProducts}>
            <ThemedText style={styles.retryText}>Réessayer</ThemedText>
          </Pressable>
        </ThemedView>
      );
    }

    // État empty
    if (products.length === 0) {
      return (
        <ThemedView style={styles.centered}>
          <ThemedText style={styles.statusText}>Aucun produit disponible.</ThemedText>
        </ThemedView>
      );
    }

    // État normal
    return (
      <ThemedView style={styles.gridContainer}>
        {products.map((product) => (
          <Link href={`/product/${product.id}`} key={product.id} asChild>
            <Pressable style={styles.productCard}>
              <Image
                source={{ uri: product.image_url }}
                style={styles.productImage}
                contentFit="contain"
              />
              <ThemedText type="defaultSemiBold" style={styles.productName}>
                {product.name}
              </ThemedText>
              <ThemedText style={styles.productPrice}>
                {product.price.toFixed(2)} €
              </ThemedText>
              <ThemedText style={styles.viewDetails}>Voir les détails →</ThemedText>
            </Pressable>
          </Link>
        ))}
      </ThemedView>
    );
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FFD700', dark: '#1a1a1a' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="square.grid.2x2"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Catalogue</ThemedText>
      </ThemedView>

        {isAdminUser && (
          <Pressable style={styles.addBtn} onPress={() => router.push('/add-product')}>
            <ThemedText style={styles.addBtnText}>+ Ajouter un produit</ThemedText>
          </Pressable>
        )}

      {renderContent()}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  titleContainer: {
    marginBottom: 16,
  },
  gridContainer: {
    gap: 12,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  statusText: {
    color: '#888',
    fontSize: 15,
    textAlign: 'center',
  },
  errorText: {
    color: '#e53935',
    fontSize: 15,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addBtn: {
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 12,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  productCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e5ea',
  },
  // duplicate styles removed
  productImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
  },
  productName: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  productPrice: {
    marginTop: 4,
    color: '#0a7ea4',
    fontWeight: 'bold',
    fontSize: 14,
  },
  viewDetails: {
    marginTop: 8,
    color: '#0a7ea4',
    fontSize: 12,
  },
});
