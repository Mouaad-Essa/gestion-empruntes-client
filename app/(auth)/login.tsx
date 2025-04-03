import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/AuthContext";

import Constants from "expo-constants";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !motDePasse) {
      Alert.alert("Erreur", "Veuillez entrer votre email et mot de passe !");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mot_de_passe: motDePasse }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Échec de la connexion");
      }

      // ✅ Store token in AsyncStorage
      await AsyncStorage.setItem("token", data.token);

      console.log("Connexion réussie !", data.token);

      // ✅ Call login function from AuthContext to update user state
      await login(data.token); // This will update the user state in AuthContext

      // ✅ Add a short delay before redirecting
      setTimeout(() => {
        router.replace("/(tabs)"); // Redirect to the profile screen or homepage
      }, 100);
    } catch (error: any) {
      Alert.alert("Échec de la connexion", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-light-100 px-6">
      <Text className="text-primary text-2xl font-bold mb-6">Bienvenue !</Text>

      {/* Champ Email */}
      <View className="w-full mb-4">
        <Text className="text-dark-100 text-lg mb-2">Adresse Email</Text>
        <TextInput
          className="w-full bg-light-200 text-dark-100 p-3 rounded-lg border border-light-300"
          placeholder="Entrez votre email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Champ Mot de Passe */}
      <View className="w-full mb-6">
        <Text className="text-dark-100 text-lg mb-2">Mot de passe</Text>
        <TextInput
          className="w-full bg-light-200 text-dark-100 p-3 rounded-lg border border-light-300"
          placeholder="Entrez votre mot de passe"
          secureTextEntry
          value={motDePasse}
          onChangeText={setMotDePasse}
        />
      </View>

      {/* Bouton Connexion */}
      <TouchableOpacity
        className={`w-full bg-primary py-3 rounded-lg ${
          loading ? "opacity-50" : ""
        }`}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text className="text-white text-center text-lg font-semibold">
          {loading ? "Connexion en cours..." : "Se connecter"}
        </Text>
      </TouchableOpacity>

      {/* Lien vers l'inscription */}
      <Text className="text-dark-200 text-sm mt-4">
        Vous n'avez pas de compte ?{" "}
        <Text
          className="text-secondary font-semibold"
          onPress={() => router.push("/(auth)/register")}
        >
          Inscrivez-vous
        </Text>
      </Text>
    </View>
  );
};

export default LoginScreen;
