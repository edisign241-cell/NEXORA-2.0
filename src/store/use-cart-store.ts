import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { OrderItem, Product, Location, PaymentMethod } from "@/lib/types/marketplace";

interface CartState {
  items: OrderItem[];
  isOpen: boolean;
  deliveryLocation: Location | null;
  selectedPaymentMethod: PaymentMethod;
  deliveryFee: number;
  promoCode: string | null;
  discountAmount: number;

  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  toggleCart: () => void;
  setDeliveryLocation: (location: Location) => void;
  setSelectedPaymentMethod: (method: PaymentMethod) => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;

  // Selectors / Helpers
  getSubtotal: () => number;
  getTotalItemsCount: () => number;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      deliveryLocation: {
        province: "Estuaire",
        ville: "Libreville",
        quartier: "Nzeng-Ayong",
        repere_texte: "Face pharmacie, grand portail vert",
        telephone: "+241 077 45 89 12",
      },
      selectedPaymentMethod: "airtel_money",
      deliveryFee: 2000, // Standard delivery fee in Libreville/Akanda (2000 FCFA)
      promoCode: null,
      discountAmount: 0,

      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.productId === product.id
          );

          const price = product.prixPromo ?? product.prix;

          if (existingIndex > -1) {
            const newItems = [...state.items];
            newItems[existingIndex].quantity += quantity;
            return { items: newItems, isOpen: true };
          } else {
            const newItem: OrderItem = {
              id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              productId: product.id,
              productTitle: product.nom,
              productPrice: price,
              productImage: product.images[0] || "",
              quantity: quantity,
              storeId: product.storeId,
              storeName: product.storeName,
            };
            return { items: [...state.items, newItem], isOpen: true };
          }
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], promoCode: null, discountAmount: 0 });
      },

      setIsOpen: (isOpen: boolean) => set({ isOpen }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      setDeliveryLocation: (location: Location) =>
        set({ deliveryLocation: location }),

      setSelectedPaymentMethod: (method: PaymentMethod) =>
        set({ selectedPaymentMethod: method }),

      applyPromoCode: (code: string) => {
        const clean = code.trim().toUpperCase();
        if (clean === "NEXORA241" || clean === "GABON2024") {
          const discount = 2000; // 2 000 FCFA discount
          set({ promoCode: clean, discountAmount: discount });
          return true;
        }
        return false;
      },

      removePromoCode: () => set({ promoCode: null, discountAmount: 0 }),

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.productPrice * item.quantity,
          0
        );
      },

      getTotalItemsCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalAmount: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const fee = get().deliveryFee;
        const discount = get().discountAmount;
        return Math.max(0, subtotal + fee - discount);
      },
    }),
    {
      name: "nexora-cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        deliveryLocation: state.deliveryLocation,
        selectedPaymentMethod: state.selectedPaymentMethod,
      }),
    }
  )
);
