import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Constants from "expo-constants";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const EmpruntScreen = () => {
  const [emprunts, setEmprunts] = useState<any[]>([]);

  // Fetch emprunts data
  const fetchEmprunts = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/api/emp/userEmprunt`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEmprunts(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des emprunts", error);
    }
  };

  // Re-fetch the emprunts data every time the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchEmprunts();
    }, [])
  );

  return (
    <ScrollView className="flex-1 bg-light-100 px-4 py-6">
      <Text className="text-dark-100 text-3xl font-semibold mb-6">
        Liste des Emprunts
      </Text>

      {emprunts.length > 0 ? (
        emprunts.map((emprunt) => (
          <View
            key={emprunt.id}
            className="p-4 bg-white rounded-lg shadow-md border border-light-300 mb-4"
          >
            <Text className="text-lg font-bold text-dark-800">
              📖 {emprunt.livre_titre} - {emprunt.livre_auteur}
            </Text>
            <Text className="text-sm text-dark-600">
              👤 Emprunté par: {emprunt.utilisateur_nom}
            </Text>
            <Text className="text-sm text-dark-500">
              📅 Date d'emprunt:{" "}
              {new Date(emprunt.date_emprunt).toLocaleDateString()}
            </Text>
            <Text className="text-sm text-red-500">
              ⏳ Retour prévu:{" "}
              {new Date(emprunt.date_retour_prevue).toLocaleDateString()}
            </Text>
          </View>
        ))
      ) : (
        <Text className="text-center text-dark-600">Aucun emprunt trouvé.</Text>
      )}
    </ScrollView>
  );
};

export default EmpruntScreen;
