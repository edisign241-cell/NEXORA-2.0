import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User, UserRole, Location } from "@/lib/types/marketplace";

interface UserState {
  user: User | null;
  role: UserRole;
  isLocationModalOpen: boolean;
  selectedLocation: Location;

  // Actions
  setRole: (role: UserRole) => void;
  setUser: (user: User | null) => void;
  setLocation: (location: Location) => void;
  setIsLocationModalOpen: (open: boolean) => void;
  toggleLocationModal: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      role: "client",
      isLocationModalOpen: false,
      selectedLocation: {
        province: "Estuaire",
        ville: "Libreville",
        quartier: "Centre-Ville",
        repere_texte: "Face voie principale, Libreville",
        telephone: "",
      },

      setRole: (role: UserRole) => {
        set({ role });
      },

      setUser: (user: User | null) =>
        set({
          user,
          role: user ? user.role : "client",
          ...(user?.location ? { selectedLocation: user.location } : {}),
        }),

      setLocation: (location: Location) => set({ selectedLocation: location }),

      setIsLocationModalOpen: (open: boolean) =>
        set({ isLocationModalOpen: open }),

      toggleLocationModal: () =>
        set((state) => ({ isLocationModalOpen: !state.isLocationModalOpen })),
    }),
    {
      name: "nexora-user-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        role: state.role,
        user: state.user,
        selectedLocation: state.selectedLocation,
      }),
    }
  )
);
