"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { UserRole } from "@/lib/types/marketplace";
import { useUserStore } from "@/store/use-user-store";
import { type User as SupabaseUser, type Session } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  email?: string | null;
  full_name: string;
  phone?: string | null;
  role: UserRole;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: SupabaseUser | null;
  profile: UserProfile | null;
  role: UserRole;
  session: Session | null;
  isLoading: boolean;
  isVendor: boolean;
  isCourier: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  switchRoleDemo: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Zustand Store sync
  const { role: storeRole, setRole: setStoreRole, setUser: setStoreUser } = useUserStore();

  const fetchProfile = useCallback(async (userId: string, currentUser?: SupabaseUser) => {
    if (!isSupabaseConfigured) return null;

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error || !data) {
        // Fallback to user metadata
        const metadataRole = (currentUser?.user_metadata?.role as UserRole) || "client";
        const fallbackProfile: UserProfile = {
          id: userId,
          email: currentUser?.email,
          full_name: currentUser?.user_metadata?.full_name || "Utilisateur Nexora",
          phone: currentUser?.user_metadata?.phone,
          role: metadataRole,
          avatar_url: currentUser?.user_metadata?.avatar_url,
        };
        setProfile(fallbackProfile);
        return fallbackProfile;
      }

      const rawData = data as any;
      const normalizedProfile: UserProfile = {
        id: rawData.id,
        email: rawData.email,
        full_name: rawData.full_name,
        phone: rawData.phone,
        role: (rawData.role as UserRole) || "client",
        avatar_url: rawData.avatar_url,
        created_at: rawData.created_at,
        updated_at: rawData.updated_at,
      };

      setProfile(normalizedProfile);
      setStoreRole(normalizedProfile.role);
      return normalizedProfile;
    } catch {
      return null;
    }
  }, [setStoreRole]);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id, user);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    const supabase = createClient();

    // 1. Initial Session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      if (initialSession?.user) {
        fetchProfile(initialSession.user.id, initialSession.user);
      }
      setIsLoading(false);
    });

    // 2. Listen to Auth State Changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      const currentUser = newSession?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        await fetchProfile(currentUser.id, currentUser);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const handleSignOut = async () => {
    if (isSupabaseConfigured) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    setSession(null);
    setStoreRole("client");
  };

  const switchRoleDemo = (newRole: UserRole) => {
    setStoreRole(newRole);
    if (profile) {
      setProfile({ ...profile, role: newRole });
    }
  };

  // Determine current active role (from Supabase profile, or store in demo mode)
  const currentRole: UserRole = profile?.role || storeRole || "client";

  const isVendor = currentRole === "vendor" || currentRole === "vendeur";
  const isCourier = currentRole === "courier" || currentRole === "livreur";
  const isAdmin = currentRole === "admin";
  const isCustomer = !isVendor && !isCourier && !isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role: currentRole,
        session,
        isLoading,
        isVendor,
        isCourier,
        isAdmin,
        isCustomer,
        signOut: handleSignOut,
        refreshProfile,
        switchRoleDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
