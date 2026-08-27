import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User, UserRole, Location } from "@/lib/types/marketplace";
import { MOCK_USERS } from "@/lib/constants/mock-data";

interface UserState {
  user: User;
  role: UserRole;
  isLocationModalOpen: boolean;
  selectedLocation: Location;

  // Actions
  setRole: (role: UserRole) => void;
  setUser: (user: User) => void;
  setLocation: (location: Location) => void;
  setIsLocationModalOpen: (open: boolean) => void;
  toggleLocationModal: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: MOCK_USERS.client,
      role: "client",
      isLocationModalOpen: false,
      selectedLocation: {
        province: "Estuaire",
        ville: "Libreville",
        quartier: "Nzeng-Ayong",
        repere_texte: "Face pharmacie de Nzeng-Ayong, grand portail vert",
        telephone: "+241 077 45 89 12",
      },

      setRole: (role: UserRole) => {
        const correspondingUser = MOCK_USERS[role] || MOCK_USERS.client;
        set({
          role,
          user: correspondingUser,
          selectedLocation: correspondingUser.location || {
            province: "Estuaire",
            ville: "Libreville",
            quartier: "Centre-Ville",
            repere_texte: "Bord de mer, Immeuble interbancaire",
            telephone: correspondingUser.telephone,
          },
        });
      },

      setUser: (user: User) => set({ user, role: user.role }),

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
