import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";

const LivreDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const [book, setBook] = useState<any>(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const url = `http://192.168.56.1:5000/api/livre/${id}`;
        const response = await axios.get(url);
        setBook(response.data);
      } catch (error) {
        console.error("Failed to fetch book details", error);
      }
    };
    fetchBookDetails();
  }, [id]);

  return (
    <ScrollView className="flex-1 bg-light-100 p-6">
      {book ? (
        <>
          <Text className="text-3xl font-bold text-primary">{book.titre}</Text>
          <Text className="text-lg text-dark-600">{book.auteur}</Text>
          <Text className="text-md text-dark-500 my-4">{book.description}</Text>
          <Text className="text-sm text-dark-400">
            Publié en {book.annee_publication}
          </Text>
          <Text className="text-sm text-dark-400">ISBN: {book.isbn}</Text>
        </>
      ) : (
        <Text>Chargement des informations...</Text>
      )}
    </ScrollView>
  );
};

export default LivreDetailsScreen;
