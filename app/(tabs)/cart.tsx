import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useCartStore } from '../../store/useCartStore';

export default function Cart() {
  const cart = useCartStore((state) => state.cart);
  const loading = useCartStore((state) => state.loading);
  const loadCart = useCartStore((state) => state.loadCart);
  const removeItem = useCartStore((state) => state.removeItem);
  const incrementItem = useCartStore((state) => state.incrementItem);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    loadCart();
  }, []);

  const total = cart.reduce((sum, item) => sum + item.prix * item.quantity, 0);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0a7ea4" />
        <Text style={styles.statusText}>Chargement du panier...</Text>
      </View>
    );
  }

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛍️</Text>
        <Text style={styles.emptyTitle}>Votre panier est vide</Text>
        <Text style={styles.emptySubtitle}>Ajoutez des articles depuis le catalogue</Text>
        <Pressable style={styles.shopBtn} onPress={() => router.push('/(tabs)/catalogue')}>
          <Text style={styles.shopBtnText}>Voir le catalogue</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon panier</Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            {item.image_url ? (
              <Image source={{ uri: item.image_url }} style={styles.itemImage} contentFit="cover" />
            ) : (
              <View style={[styles.itemImage, styles.imagePlaceholder]}>
                <Text style={styles.placeholderText}>👗</Text>
              </View>
            )}

            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={2}>{item.nom}</Text>
              <Text style={styles.itemPrice}>{item.prix.toFixed(2)} €</Text>

              <View style={styles.qtyRow}>
                <Pressable style={styles.qtyBtn} onPress={() => decrementItem(item.id)}>
                  <Text style={styles.qtyBtnText}>−</Text>
                </Pressable>
                <Text style={styles.qtyValue}>{item.quantity}</Text>
                <Pressable style={styles.qtyBtn} onPress={() => incrementItem(item.id)}>
                  <Text style={styles.qtyBtnText}>+</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.itemRight}>
              <Text style={styles.itemTotal}>{(item.prix * item.quantity).toFixed(2)} €</Text>
              <Pressable onPress={() => removeItem(item.id)} style={styles.deleteBtn}>
                <Text style={styles.deleteIcon}>🗑️</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>{total.toFixed(2)} €</Text>
        </View>
        <Pressable style={styles.checkoutBtn}>
          <Text style={styles.checkoutText}>Commander</Text>
        </Pressable>
        <Pressable style={styles.clearBtn} onPress={clearCart}>
          <Text style={styles.clearText}>Vider le panier</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  statusText: { color: '#888', fontSize: 15 },
  title: { fontSize: 22, fontWeight: 'bold', padding: 16, paddingBottom: 8, color: '#1a1a1a' },
  list: { padding: 16, paddingTop: 8 },
  separator: { height: 12 },
  itemCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#eee', gap: 12, alignItems: 'center' },
  itemImage: { width: 70, height: 70, borderRadius: 8 },
  imagePlaceholder: { backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' },
  placeholderText: { fontSize: 28 },
  itemInfo: { flex: 1, gap: 4 },
  itemName: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  itemPrice: { fontSize: 13, color: '#888' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  qtyBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  qtyValue: { fontSize: 15, fontWeight: '600', minWidth: 20, textAlign: 'center' },
  itemRight: { alignItems: 'flex-end', justifyContent: 'space-between', height: 70 },
  itemTotal: { fontSize: 15, fontWeight: 'bold', color: '#0a7ea4' },
  deleteBtn: { padding: 4 },
  deleteIcon: { fontSize: 18 },
  footer: { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', padding: 16, gap: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 16, color: '#555' },
  totalAmount: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a' },
  checkoutBtn: { backgroundColor: '#0a7ea4', borderRadius: 12, padding: 16, alignItems: 'center' },
  checkoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  clearBtn: { alignItems: 'center', padding: 8 },
  clearText: { color: '#e53935', fontSize: 14 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32, backgroundColor: '#f9f9f9' },
  emptyIcon: { fontSize: 64 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#1a1a1a' },
  emptySubtitle: { fontSize: 14, color: '#888', textAlign: 'center' },
  shopBtn: { backgroundColor: '#0a7ea4', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12, marginTop: 8 },
  shopBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
