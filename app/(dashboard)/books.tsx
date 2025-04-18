import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Image,
  Modal,
} from "react-native";
import { User, Plus, X, Pen } from "lucide-react-native";
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

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<number | null>(null);

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

  useFocusEffect(
    React.useCallback(() => {
      fetchBooks();
    }, [])
  );

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

  const handleNavigateToAddUser = () => {
    router.push("../livre/addBook");
  };

  const handleNavigateToUpdateUser = (id: number) => {
    router.push(`../livre/updateBook/${id}`);
  };

  const confirmDeleteBook = (id: number) => {
    setBookToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteBook = async () => {
    if (!bookToDelete) return;

    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(`${apiUrl}/api/livre/${bookToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchBooks();
      setShowDeleteModal(false);
      setBookToDelete(null);
    } catch (error) {
      console.error("Échec de la suppression du livre", error);
    }
  };

  return (
    <View className="flex-1 bg-light-100 p-6">
      <Text className="text-dark-100 text-3xl font-semibold mb-6">
        Liste des Livres
      </Text>

      <TouchableOpacity
        onPress={handleNavigateToAddUser}
        className="absolute top-6 right-6 bg-primary p-3 rounded-full"
      >
        <Plus size={24} color="white" />
      </TouchableOpacity>

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

      <ScrollView className="flex gap-3">
        {filteredBooks.map((book) => (
          <View
            key={book.id}
            className="bg-white p-4 mb-3 rounded-lg shadow-md flex-row justify-between items-start"
          >
            <View className="flex-1">
              <Image
                source={{
                  uri: book.couverture
                    ? book.couverture
                    : "https://via.placeholder.com/150",
                }}
                className="w-32 h-32 rounded-lg mb-4 bg-gray-300"
              />
              <Text className="text-dark-100 font-semibold text-lg">
                {book.titre}
              </Text>
              <Text className="text-dark-200">{book.auteur}</Text>
              <Text className="text-dark-300">{book.annee_publication}</Text>
              <Text className="text-dark-400">Genre: {book.genre}</Text>
              <Text className="text-dark-400">ISBN: {book.isbn}</Text>
              <Text className="text-dark-500 mt-2">{book.description}</Text>
            </View>

            <View className="flex-row space-x-4 gap-2 self-end">
              <TouchableOpacity
                onPress={() => handleNavigateToUpdateUser(book.id)}
                className="bg-secondary p-3 rounded-full"
              >
                <Pen size={25} color={"#fff"} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => confirmDeleteBook(book.id)}
                className="bg-red-500 p-3 rounded-full"
              >
                <X size={25} color={"#fff"} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-8">
          <View className="bg-white p-6 rounded-xl w-full max-w-md items-center">
            <Text className="text-lg font-semibold mb-4 text-center">
              Voulez-vous vraiment supprimer ce livre ?
            </Text>
            <View className="flex-row space-x-4 mt-4">
              <TouchableOpacity
                onPress={() => setShowDeleteModal(false)}
                className="bg-gray-300 px-4 py-2 rounded-md"
              >
                <Text className="text-gray-800 font-medium">Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeleteBook}
                className="bg-red-500 px-4 py-2 rounded-md"
              >
                <Text className="text-white font-medium">Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Users;
