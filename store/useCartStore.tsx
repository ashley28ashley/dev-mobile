import { create } from "zustand";

export type CartItem = {
  id: string;
  nom: string;
  prix?: number;
  quantite?: number;
};

type CartStore = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>((set) => ({
  cart: [],

  addToCart: (item) =>
    set((state) => {
      const exists = state.cart.find((i) => i.id === item.id);
      if (exists) {
        return {
          cart: state.cart.map((i) =>
            i.id === item.id
              ? { ...i, quantite: (i.quantite ?? 1) + 1 }
              : i
          ),
        };
      }
      return { cart: [...state.cart, { ...item, quantite: 1 }] };
    }),

  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((i) => i.id !== id),
    })),

  clearCart: () => set({ cart: [] }),
}));