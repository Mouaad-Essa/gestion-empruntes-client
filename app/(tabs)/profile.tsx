import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../AuthContext";
import jwtDecode from "jwt-decode";
import axios from "axios";
import Constants from "expo-constants";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

type DecodedToken = {
  id: number;
  email: string;
  role: string;
  exp: number;
};

const Profile = () => {
  const { logout, isLoading } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        setToken(storedToken);

        if (!storedToken) throw new Error("Token introuvable");

        const decoded: DecodedToken = jwtDecode(storedToken);
        const userId = decoded.id;

        const { data } = await axios.get(`${apiUrl}/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        setProfile(data);
      } catch (err: any) {
        Alert.alert("Erreur", err.response?.data?.message || "Erreur serveur");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  if (loading || isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-light-100">
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-light-100 px-6 py-8">
      <Text className="text-3xl font-extrabold text-primary text-center mb-10">
        Mon Profil
      </Text>

      {profile ? (
        <View className="bg-white p-6 rounded-2xl shadow-md space-y-6">
          <View>
            <Text className="text-lg font-semibold text-dark-100 mb-1">
              Nom complet
            </Text>
            <Text className="text-base text-dark-300">{profile.nom}</Text>
          </View>

          <View>
            <Text className="text-lg font-semibold text-dark-100 mb-1">
              Email
            </Text>
            <Text className="text-base text-dark-300">{profile.email}</Text>
          </View>

          <View>
            <Text className="text-lg font-semibold text-dark-100 mb-1">
              Rôle
            </Text>
            <Text className="text-base text-dark-300 capitalize">
              {profile.role}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            className="mt-6 bg-secondary py-4 rounded-xl shadow-sm"
          >
            <Text className="text-center text-primary font-bold text-base">
              Déconnexion
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text className="text-center text-red-600 text-lg mt-8">
          Impossible de charger le profil.
        </Text>
      )}
    </ScrollView>
  );
};

export default Profile;
