import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";

import Constants from "expo-constants";
import { LibraryBig } from "lucide-react-native";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const RegisterScreen = () => {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nom || !email || !motDePasse) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs !");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nom, email, mot_de_passe: motDePasse }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Échec de l'inscription");
      }

      // Inscription réussie
      console.log("Inscription réussie !", data);

      // Rediriger vers la page de connexion
      router.replace("/(auth)/login");
    } catch (error: any) {
      Alert.alert("Échec de l'inscription", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-light-100 px-6">
      {/* E-biblio Logo */}
      <View className="flex flex-row items-center justify-center mb-14">
        <LibraryBig size={50} color={"#FACC15"} />
        <Text className="text-3xl font-bold text-primary ml-2">E-biblio</Text>
      </View>

      <Text className="text-primary self-start text-2xl font-bold mb-6">
        Créez votre compte
      </Text>

      {/* Champ Nom */}
      <View className="w-full mb-4">
        <Text className="text-dark-100 text-lg mb-2">Nom Complet</Text>
        <TextInput
          className="w-full bg-light-200 text-dark-100 p-3 rounded-lg border border-light-300"
          placeholder="Entrez votre nom complet"
          value={nom}
          onChangeText={setNom}
        />
      </View>

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

      {/* Bouton Inscription */}
      <TouchableOpacity
        className={`w-full bg-primary py-3 rounded-lg ${
          loading ? "opacity-50" : ""
        }`}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text className="text-white text-center text-lg font-semibold">
          {loading ? "Création en cours..." : "S'inscrire"}
        </Text>
      </TouchableOpacity>

      {/* Lien vers la connexion */}
      <Text className="text-dark-200 text-sm mt-4">
        Vous avez déjà un compte ?{" "}
        <Text
          className="text-secondary font-semibold"
          onPress={() => router.push("/(auth)/login")}
        >
          Se connecter
        </Text>
      </Text>
    </View>
  );
};

export default RegisterScreen;
