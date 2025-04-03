import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Image,
} from "react-native";
import { User, Plus, X, PenLine, Pen } from "lucide-react-native"; // Import Lucide Icons
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { useFocusEffect } from "@react-navigation/native";

// API URL
const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const Users = () => {
  const router = useRouter();
  const [books, setBooks] = useState<any[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [showOnlyAvailable, setShowOnlyAvailable] = useState<boolean>(false);

  // Fetch books from API
  const fetchBooks = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/api/livres`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBooks(response.data);
    } catch (error) {
      console.error("Échec de récupération des livres", error);
    }
  };

  // Re-fetch books every time the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchBooks();
    }, [])
  );

  // Filter books based on name and availability
  useEffect(() => {
    const filterBooks = () => {
      let filtered = books;

      if (nameFilter) {
        filtered = filtered.filter((book) =>
          book.titre.toLowerCase().includes(nameFilter.toLowerCase())
        );
      }

      if (showOnlyAvailable) {
        filtered = filtered.filter((book) => !book.est_emprunte);
      }

      setFilteredBooks(filtered);
    };

    filterBooks();
  }, [books, nameFilter, showOnlyAvailable]);

  // Handle navigation to the Add User screen
  const handleNavigateToAddUser = () => {
    router.push("../livre/addBook");
  };

  // Handle navigation to the Update User screen
  const handleNavigateToUpdateUser = (id: number) => {
    router.push(`../users/${id}`);
  };

  // Handle Delete Book
  const handleDeleteBook = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(`${apiUrl}/api/livres/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Re-fetch the books after deletion
      fetchBooks();
    } catch (error) {
      console.error("Échec de la suppression du livre", error);
    }
  };

  return (
    <View className="flex-1 bg-light-100 p-6">
      <Text className="text-dark-100 text-3xl font-semibold mb-6">
        Liste des Livres
      </Text>

      {/* Add Book Button */}
      <TouchableOpacity
        onPress={handleNavigateToAddUser}
        className="absolute top-6 right-6 bg-primary p-3 rounded-full"
      >
        <Plus size={24} color="white" />
      </TouchableOpacity>

      {/* Filter Inputs */}
      <View className="mb-6">
        <TextInput
          value={nameFilter}
          onChangeText={setNameFilter}
          placeholder="Rechercher par titre de livre"
          className="mb-3 p-3 border border-light-300 bg-white rounded-lg text-dark-700"
        />
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

      {/* Scrollable List of Books */}
      <ScrollView className="flex gap-3">
        {filteredBooks.map((book) => (
          <View
            key={book.id}
            className="bg-white p-4 mb-3 rounded-lg shadow-md flex-row justify-between items-start"
          >
            <View className="flex-1">
              {/* Book Cover */}
              <Image
                source={{
                  uri: book.couverture
                    ? book.couverture // Assuming the couverture is a valid URL or base64 string
                    : "https://via.placeholder.com/150", // Placeholder image
                }}
                className="w-32 h-32 rounded-lg mb-4 bg-gray-300"
              />
              {/* Book Title, Author, Year of Publication */}
              <Text className="text-dark-100 font-semibold text-lg">
                {book.titre}
              </Text>
              <Text className="text-dark-200">{book.auteur}</Text>
              <Text className="text-dark-300">{book.annee_publication}</Text>

              {/* Genre, ISBN */}
              <Text className="text-dark-400">Genre: {book.genre}</Text>
              <Text className="text-dark-400">ISBN: {book.isbn}</Text>

              {/* Description */}
              <Text className="text-dark-500 mt-2">{book.description}</Text>
            </View>

            {/* Buttons Section */}
            <View className="flex-row space-x-4 gap-2 self-end">
              {/* Update Button */}
              <TouchableOpacity
                onPress={() => handleNavigateToUpdateUser(book.id)}
                className="bg-secondary p-3 rounded-full"
              >
                <Pen size={25} color={"#fff"} />
              </TouchableOpacity>
              {/* Delete Button */}
              <TouchableOpacity
                onPress={() => handleDeleteBook(book.id)}
                className="bg-red-500 p-3 rounded-full"
              >
                <X size={25} color={"#fff"} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Users;
