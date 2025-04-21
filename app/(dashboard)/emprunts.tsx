import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const Emprunts = () => {
  const [emprunts, setEmprunts] = useState([]);

  const fetchEmprunts = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const { data } = await axios.get(`${apiUrl}/api/emp/emprunts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmprunts(data);
    } catch (error: any) {
      Alert.alert("Erreur", error.response?.data?.message || "Erreur serveur");
    }
  };

  const deleteEmprunt = async (id: number) => {
    Alert.alert("Confirmation", "Voulez-vous supprimer cet emprunt ?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            await axios.delete(`${apiUrl}/api/emp/emprunts/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            fetchEmprunts();
          } catch (error: any) {
            Alert.alert(
              "Erreur",
              error.response?.data?.message || "Erreur serveur"
            );
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchEmprunts();
  }, []);

  return (
    <ScrollView className="flex-1 bg-light-100 px-4 pt-6 my-4">
      <Text className="text-2xl font-bold text-dark-100 mb-4">
        📚 Liste des Emprunts
      </Text>

      {emprunts.map((item: any) => (
        <View
          key={item.id}
          className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-light-200"
        >
          <Text className="text-lg font-semibold text-primary mb-1">
            {item.livre_titre}
          </Text>
          <Text className="text-sm text-dark-200">
            Auteur : {item.livre_auteur}
          </Text>
          <Text className="text-sm text-dark-200">
            Emprunté par : {item.utilisateur_nom}
          </Text>
          <Text className="text-sm text-dark-200">
            Date d'emprunt : {new Date(item.date_emprunt).toLocaleDateString()}
          </Text>
          <Text className="text-sm text-dark-200 mb-3">
            Retour prévu :{" "}
            {new Date(item.date_retour_prevue).toLocaleDateString()}
          </Text>

          <TouchableOpacity
            className="bg-secondary py-2 px-4 rounded-xl"
            onPress={() => deleteEmprunt(item.id)}
          >
            <Text className="text-dark-100 font-semibold text-center">
              Supprimer l’emprunt
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

export default Emprunts;
