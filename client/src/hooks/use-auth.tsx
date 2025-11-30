import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: string;
  username: string;
}

interface AuthResponse {
  user?: User;
  error?: string;
}

interface SavedIdsResponse {
  ids?: string[];
  error?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  savedToolIds: string[];
  saveTool: (toolId: string) => Promise<void>;
  unsaveTool: (toolId: string) => Promise<void>;
  isToolSaved: (toolId: string) => boolean;
  refreshSavedTools: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [savedToolIds, setSavedToolIds] = useState<string[]>([]);

  const { data: userData, isLoading: isUserLoading } = useQuery<AuthResponse>({
    queryKey: ["/api/auth/me"],
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const user = userData?.user || null;
  const isAuthenticated = !!user;

  const { data: savedIdsData, refetch: refetchSavedIds } = useQuery<SavedIdsResponse>({
    queryKey: ["/api/saved-tools/ids"],
    enabled: isAuthenticated,
    retry: false,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (savedIdsData?.ids) {
      setSavedToolIds(savedIdsData.ids);
    } else if (!isAuthenticated) {
      setSavedToolIds([]);
    }
  }, [savedIdsData, isAuthenticated]);

  const login = useCallback(async (username: string, password: string) => {
    const res = await apiRequest("POST", "/api/auth/login", { username, password });
    const data = await res.json();
    await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    await queryClient.invalidateQueries({ queryKey: ["/api/saved-tools/ids"] });
    return data;
  }, [queryClient]);

  const signup = useCallback(async (username: string, email: string, password: string) => {
    const res = await apiRequest("POST", "/api/auth/signup", { username, email, password });
    const data = await res.json();
    await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    return data;
  }, [queryClient]);

  const logout = useCallback(async () => {
    await apiRequest("POST", "/api/auth/logout", {});
    await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    await queryClient.invalidateQueries({ queryKey: ["/api/saved-tools/ids"] });
    await queryClient.invalidateQueries({ queryKey: ["/api/saved-tools"] });
    setSavedToolIds([]);
  }, [queryClient]);

  const saveTool = useCallback(async (toolId: string) => {
    if (!isAuthenticated) {
      throw new Error("يجب تسجيل الدخول لحفظ الأدوات");
    }
    
    const previousIds = [...savedToolIds];
    setSavedToolIds(prev => [...prev, toolId]);
    
    try {
      await apiRequest("POST", `/api/saved-tools/${toolId}`, {});
      queryClient.invalidateQueries({ queryKey: ["/api/saved-tools"] });
      queryClient.invalidateQueries({ queryKey: ["/api/saved-tools/ids"] });
    } catch (error) {
      setSavedToolIds(previousIds);
      throw error;
    }
  }, [isAuthenticated, queryClient, savedToolIds]);

  const unsaveTool = useCallback(async (toolId: string) => {
    if (!isAuthenticated) {
      throw new Error("يجب تسجيل الدخول لإزالة الأدوات");
    }
    
    const previousIds = [...savedToolIds];
    setSavedToolIds(prev => prev.filter(id => id !== toolId));
    
    try {
      await apiRequest("DELETE", `/api/saved-tools/${toolId}`, undefined);
      queryClient.invalidateQueries({ queryKey: ["/api/saved-tools"] });
      queryClient.invalidateQueries({ queryKey: ["/api/saved-tools/ids"] });
    } catch (error) {
      setSavedToolIds(previousIds);
      throw error;
    }
  }, [isAuthenticated, queryClient, savedToolIds]);

  const isToolSaved = useCallback((toolId: string) => {
    return savedToolIds.includes(toolId);
  }, [savedToolIds]);

  const refreshSavedTools = useCallback(() => {
    if (isAuthenticated) {
      refetchSavedIds();
    }
  }, [isAuthenticated, refetchSavedIds]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isUserLoading,
        isAuthenticated,
        login,
        signup,
        logout,
        savedToolIds,
        saveTool,
        unsaveTool,
        isToolSaved,
        refreshSavedTools,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
