import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "../../AuthContext";
import { ArrowLeft } from "lucide-react-native";
import Constants from "expo-constants";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const LivreDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const { user, token } = useAuth();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const url = `${apiUrl}/api/livre/${id}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const bookData = {
          ...response.data,
          est_emprunte: Boolean(response.data.est_emprunte),
        };

        setBook(bookData);
      } catch (err) {
        console.error("Failed to fetch book details", err);
        setError("Impossible de charger le livre.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id, token]);

  const handleEmprunter = async () => {
    if (!user || !book) return;

    // Show confirmation dialog before borrowing
    Alert.alert(
      "Confirmer l'emprunt",
      "Êtes-vous sûr de vouloir emprunter ce livre ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Confirmer",
          onPress: async () => {
            try {
              const response = await axios.post(
                `${apiUrl}/api/emp/emprunter`,
                { utilisateur_id: user.id, livre_id: book.id },
                { headers: { Authorization: `Bearer ${token}` } }
              );

              setBook((prevBook: any) => ({
                ...prevBook,
                est_emprunte: true,
              }));

              // Redirect to home
              router.push("/");
            } catch (err) {
              console.error("Erreur lors de l'emprunt", err);
              setError("Erreur lors de l'emprunt.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView className="flex-1 bg-light-200">
      {loading ? (
        <Text className="text-center mt-5">Chargement des informations...</Text>
      ) : error ? (
        <Text className="text-center text-red-500 mt-5">{error}</Text>
      ) : (
        <>
          {/* Return Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex items-center justify-center p-3 
            flex-row gap-2 rounded-full shadow-md
            m-3
            w-2/6
            bg-primary"
          >
            <ArrowLeft size={25} color={"#f6f6f6"} />
            <Text className="text-light-200 font-bold">Retour</Text>
          </TouchableOpacity>

          {/* Placeholder for Book Image */}
          <View className="w-full h-auto bg-gray-200 items-center justify-center">
            <Image
              source={{
                uri: book.couverture || "https://via.placeholder.com/300",
              }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          {/* Book Details */}
          <View className="p-6">
            <Text className="text-3xl font-bold text-primary">
              {book.titre}
            </Text>
            <Text className="text-lg text-dark-600">{book.auteur}</Text>
            <Text className="text-md text-dark-500 my-4">
              {book.description}
            </Text>
            <Text className="text-sm text-dark-400">
              Publié en {book.annee_publication}
            </Text>
            <Text className="text-sm text-dark-400">ISBN: {book.isbn}</Text>
          </View>

          {/* Emprunter Button */}
          <View className="p-6">
            <TouchableOpacity
              className={`p-4 rounded-lg ${
                book.est_emprunte ? "bg-gray-400" : "bg-primary"
              }`}
              disabled={book.est_emprunte}
              onPress={handleEmprunter}
            >
              <Text className="text-white text-center">
                {book.est_emprunte ? "Déjà emprunté" : "Emprunter"}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default LivreDetailsScreen;
