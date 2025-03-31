import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { Eye } from "lucide-react-native";

const IndexScreen = () => {
  const router = useRouter();
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    // Fetch books data from API
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://192.168.56.1:5000/api/livres");
        setBooks(response.data);
      } catch (error) {
        console.error("Failed to fetch books", error);
      }
    };
    fetchBooks();
  }, []);

  const handleNavigateToDetails = (id: number) => {
    router.push(`/livre/${id}`);
  };

  return (
    <ScrollView className="flex-1 bg-light-100 px-4 py-6">
      <Text className="text-primary text-3xl font-semibold mb-6">
        Liste des Livres
      </Text>

      {/* Grid to display books in 2 per row */}
      <View className="flex-row flex-wrap gap-4">
        {books.map((book) => (
          <View
            key={book.id}
            className="w-[45%] p-3  bg-white rounded-lg shadow-md border border-light-300"
          >
            <Image
              source={{
                uri: "https://via.placeholder.com/150", // Placeholder image URL
              }}
              className="w-full h-40 rounded-lg mb-4"
            />
            <Text className="text-lg font-bold text-dark-800">
              {book.titre}
            </Text>
            <Text className="text-sm text-dark-600">{book.auteur}</Text>
            <Text className="text-sm text-dark-500 mb-4">
              {book.annee_publication}
            </Text>

            {/* Voir Details Button */}
            <TouchableOpacity
              onPress={() => handleNavigateToDetails(book.id)}
              className="bg-primary py-2 rounded-lg flex items-center "
            >
              <View className="flex items-center justify-center flex-row gap-2">
                <Text className="text-white font-semibold">Voir Détails</Text>
                <Eye size={20} color={"#fff"} />
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default IndexScreen;
