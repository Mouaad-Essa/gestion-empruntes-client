import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode"; // Correct import
// Define types for AuthContext
type User = {
  id: number;
  role: string;
} | null;

type AuthContextType = {
  user: User;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const decoded: any = jwtDecode(token);
          setUser({ id: decoded.id, role: decoded.role }); // ✅ Extract user data
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (token: string) => {
    try {
      await AsyncStorage.setItem("token", token);
      const decoded: any = jwtDecode(token);
      setUser({ id: decoded.id, role: decoded.role });
    } catch (error) {
      console.error("Error storing token:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
