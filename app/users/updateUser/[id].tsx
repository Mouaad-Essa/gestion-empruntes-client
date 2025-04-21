import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ArrowLeft } from "lucide-react-native";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const UpdateUser = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Get user ID from params

  const [loading, setLoading] = useState(true);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [role, setRole] = useState("utilisateur");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await axios.get(`${apiUrl}/api/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = res.data;
        setNom(user.nom);
        setEmail(user.email);
        setRole(user.role);
      } catch (err) {
        Alert.alert("Erreur", "Impossible de charger l'utilisateur.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleUpdate = async () => {
    if (!nom || !email) {
      Alert.alert("Erreur", "Tous les champs doivent être remplis !");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      await axios.put(
        `${apiUrl}/api/user/${id}`,
        {
          nom,
          email,
          mot_de_passe: motDePasse !== "" ? motDePasse : undefined,
          role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Succès", "Utilisateur mis à jour !");
      router.push("/users");
    } catch (err: any) {
      Alert.alert("Erreur", err.response?.data?.message || "Erreur serveur");
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F8F8F8", padding: 16 }}>
      <TouchableOpacity
        onPress={() => router.back()}
        className="flex items-center justify-center p-3 
            flex-row gap-2 rounded-full shadow-md
            my-2
            w-2/5
            bg-primary"
      >
        <ArrowLeft size={25} color={"#f6f6f6"} />
        <Text className="text-light-200 font-bold">Retour</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        Modifier l'Utilisateur
      </Text>

      <TextInput
        value={nom}
        onChangeText={setNom}
        placeholder="Nom"
        style={{
          marginBottom: 12,
          padding: 12,
          borderWidth: 1,
          borderColor: "#ccc",
          backgroundColor: "#fff",
          borderRadius: 8,
        }}
      />

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        style={{
          marginBottom: 12,
          padding: 12,
          borderWidth: 1,
          borderColor: "#ccc",
          backgroundColor: "#fff",
          borderRadius: 8,
        }}
      />

      <TextInput
        value={motDePasse}
        onChangeText={setMotDePasse}
        placeholder="Nouveau mot de passe (laisser vide pour garder)"
        secureTextEntry
        style={{
          marginBottom: 12,
          padding: 12,
          borderWidth: 1,
          borderColor: "#ccc",
          backgroundColor: "#fff",
          borderRadius: 8,
        }}
      />

      <Text style={{ marginBottom: 6, fontWeight: "500" }}>Rôle</Text>
      <View
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          backgroundColor: "#fff",
          marginBottom: 20,
        }}
      >
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
          style={{
            height: 50,
            width: "100%",
          }}
          mode="dropdown"
        >
          <Picker.Item label="Utilisateur" value="utilisateur" />
          <Picker.Item label="Admin" value="admin" />
        </Picker>
      </View>

      <TouchableOpacity
        onPress={handleUpdate}
        style={{
          backgroundColor: "#007bff",
          padding: 14,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontSize: 16 }}>
          Enregistrer les modifications
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default UpdateUser;
