import { useAuth } from "@/components/providers/AuthProvider";

/**
 * Custom hook to access current authenticated user, profile and permissions.
 */
export function useUser() {
  const auth = useAuth();
  return {
    user: auth.user,
    profile: auth.profile,
    role: auth.role,
    session: auth.session,
    isLoading: auth.isLoading,
    isAuthenticated: Boolean(auth.user || auth.profile),
    isVendor: auth.isVendor,
    isCourier: auth.isCourier,
    isAdmin: auth.isAdmin,
    isCustomer: auth.isCustomer,
    signOut: auth.signOut,
    refreshProfile: auth.refreshProfile,
    switchRoleDemo: auth.switchRoleDemo,
  };
}
