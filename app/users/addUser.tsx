import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ArrowLeft } from "lucide-react-native";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const AddUser = () => {
  const router = useRouter();

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [role, setRole] = useState("utilisateur"); // default role

  const handleSubmit = async () => {
    if (!nom || !email || !motDePasse) {
      Alert.alert("Erreur", "Tous les champs doivent être remplis !");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      await axios.post(
        `${apiUrl}/api/user`,
        {
          nom,
          email,
          mot_de_passe: motDePasse,
          role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Succès", "Utilisateur créé avec succès !");
      router.push("/users");
    } catch (error: any) {
      Alert.alert("Erreur", error.response?.data?.message || "Erreur serveur");
    }
  };

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
        Ajouter un Utilisateur
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
        placeholder="Mot de passe"
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
        onPress={handleSubmit}
        style={{
          backgroundColor: "#007bff",
          padding: 14,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontSize: 16 }}>
          Ajouter Utilisateur
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddUser;
