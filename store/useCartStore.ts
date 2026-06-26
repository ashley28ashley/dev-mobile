import { create } from 'zustand';
import {
  clearCartRemote,
  deleteCartItem,
  fetchCart,
  updateCartItem,
  upsertCartItem,
} from '../services/cartApi';

export type CartItem = {
  id: string;
  nom: string;
  prix: number;
  quantity: number;
  image_url?: string;
};

type CartStore = {
  cart: CartItem[];
  loading: boolean;
  // Async actions
  loadCart: () => Promise<void>;
  addToCart: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  incrementItem: (id: string) => Promise<void>;
  decrementItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
};

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],
  loading: false,

  // Load the cart from Supabase and populate the store
  loadCart: async () => {
    set({ loading: true });
    const { data, error } = await fetchCart();
    if (error) {
      console.error('Failed to fetch cart', error);
      set({ loading: false });
      return;
    }
    const items: CartItem[] = (data ?? []).map((row: any) => ({
      id: row.product_id,
      nom: row.products?.name ?? '',
      prix: row.products?.price ?? 0,
      quantity: row.quantity,
      image_url: row.products?.image_url,
    }));
    set({ cart: items, loading: false });
  },

  // Add a product or increase its quantity
  addToCart: async (item) => {
    const existing = get().cart.find((i) => i.id === item.id);
    const newQty = (existing?.quantity ?? 0) + 1;
    // Optimistic UI update
    if (existing) {
      set((state) => ({
        cart: state.cart.map((i) => (i.id === item.id ? { ...i, quantity: newQty } : i)),
      }));
    } else {
      set((state) => ({
        cart: [...state.cart, { ...item, quantity: 1 }],
      }));
    }
    await upsertCartItem(item.id, newQty);
  },

  // Remove an item completely
  removeItem: async (id) => {
    set((state) => ({ cart: state.cart.filter((i) => i.id !== id) }));
    await deleteCartItem(id);
  },

  // Increment quantity of an existing item
  incrementItem: async (id) => {
    const item = get().cart.find((i) => i.id === id);
    if (!item) return;
    const newQty = item.quantity + 1;
    set((state) => ({
      cart: state.cart.map((i) => (i.id === id ? { ...i, quantity: newQty } : i)),
    }));
    await updateCartItem(id, newQty);
  },

  // Decrement quantity; if it reaches 0, remove the item
  decrementItem: async (id) => {
    const item = get().cart.find((i) => i.id === id);
    if (!item) return;
    if (item.quantity <= 1) {
      // Remove the item completely
      await get().removeItem(id);
      return;
    }
    const newQty = item.quantity - 1;
    set((state) => ({
      cart: state.cart.map((i) => (i.id === id ? { ...i, quantity: newQty } : i)),
    }));
    await updateCartItem(id, newQty);
  },

  // Empty the cart locally and remotely
  clearCart: async () => {
    set({ cart: [] });
    await clearCartRemote();
  },
}));