import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Eye } from "lucide-react-native";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect

const IndexScreen = () => {
  const router = useRouter();
  const [books, setBooks] = useState<any[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [showOnlyAvailable, setShowOnlyAvailable] = useState<boolean>(false);

  // Fetch books from API
  const fetchBooks = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await axios.get("http://192.168.1.17:5000/api/livres", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBooks(response.data);
    } catch (error) {
      console.error("Échec de récupération des livres", error);
    }
  };

  // Re-fetch the books every time the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchBooks();
    }, [])
  );

  useEffect(() => {
    const filterBooks = () => {
      let filtered = books;

      // Apply name filter
      if (nameFilter) {
        filtered = filtered.filter((book) =>
          book.titre.toLowerCase().includes(nameFilter.toLowerCase())
        );
      }

      // Apply availability filter (show only books that are not borrowed)
      if (showOnlyAvailable) {
        filtered = filtered.filter((book) => !book.est_emprunte);
      }

      setFilteredBooks(filtered);
    };

    // Run the filter function each time any of the filters change
    filterBooks();
  }, [books, nameFilter, showOnlyAvailable]);

  const handleNavigateToDetails = (id: number) => {
    router.push(`/livre/${id}`);
  };

  return (
    <ScrollView className="flex-1 bg-light-100 px-4 py-6">
      <Text className="text-dark-100 text-3xl font-semibold mb-6">
        Liste des Livres
      </Text>

      {/* Filter Inputs */}
      <View className="mb-6">
        <TextInput
          value={nameFilter}
          onChangeText={setNameFilter}
          placeholder="Rechercher par nom de livre"
          className="mb-3 p-3 border border-light-300 bg-white rounded-lg text-dark-700"
        />

        {/* Switch to filter only available books */}
        <View className="flex-row items-center mb-4">
          <Text className="text-sm text-dark-700 mr-2">
            Afficher uniquement les livres non empruntés
          </Text>
          <Switch
            value={showOnlyAvailable}
            onValueChange={setShowOnlyAvailable}
            trackColor={{ false: "#747474", true: "#3b82f6" }}
            thumbColor={showOnlyAvailable ? "#fff" : "#f4f3f4"}
          />
        </View>
      </View>

      {/* Grid to display books in 2 per row */}
      <View className="flex-row flex-wrap gap-4 justify-center mb-16">
        {filteredBooks.map((book) => (
          <View
            key={book.id}
            className="w-[45%] p-3 bg-white rounded-lg shadow-md border border-light-300"
          >
            <Image
              source={{
                uri: "https://via.placeholder.com/150", // Placeholder image URL
              }}
              className="w-full h-40 rounded-lg  bg-black"
            />
            <View className="flex justify-around gap-2 bg-light-200 p-1 rounded-lg my-2 flex-1 h-auto">
              <Text className="text-lg font-bold text-dark-800">
                {book.titre}
              </Text>
              <Text className="text-sm text-dark-600">{book.auteur}</Text>
              <Text className="text-sm text-dark-500 mb-4">
                {book.annee_publication}
              </Text>
            </View>

            {/* Voir Details Button */}
            <TouchableOpacity
              onPress={() => handleNavigateToDetails(book.id)}
              className="bg-primary py-2 rounded-lg flex items-center mt-auto "
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
