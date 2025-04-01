import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";

type User = {
  id: number;
  role: string;
  nom: string;
} | null;

type AuthContextType = {
  user: User;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

// Créer le contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          const decoded: any = jwtDecode(storedToken);
          const currentTime = Date.now() / 1000; // Convertir en secondes

          if (decoded.exp < currentTime) {
            // 🔴 Token expiré -> Déconnexion
            await AsyncStorage.removeItem("token");
            setUser(null);
            setToken(null);
          } else {
            // ✅ Token valide -> Charger l'utilisateur
            setUser({ id: decoded.id, role: decoded.role, nom: decoded.nom });
            setToken(storedToken);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'utilisateur :", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (newToken: string) => {
    try {
      const decoded: any = jwtDecode(newToken);
      await AsyncStorage.setItem("token", newToken);
      setUser({ id: decoded.id, role: decoded.role, nom: decoded.nom });
      setToken(newToken);
    } catch (error) {
      console.error("Erreur lors du stockage du token :", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser l'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth doit être utilisé à l'intérieur d'un AuthProvider"
    );
  }
  return context;
};
