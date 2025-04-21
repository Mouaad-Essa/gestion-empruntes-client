import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Book, User, FileText } from "lucide-react-native";
import Constants from "expo-constants";
const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const Dashboard = () => {
  const [numberOfBooks, setNumberOfBooks] = useState(null);
  const [numberOfUsers, setNumberOfUsers] = useState(null);
  const [usersWhoBorrowedBooks, setUsersWhoBorrowedBooks] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the stats from the API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/stats/count`);
        const { numberOfBooks, numberOfUsers, usersWhoBorrowedBooks } =
          response.data;

        setNumberOfBooks(numberOfBooks);
        setNumberOfUsers(numberOfUsers);
        setUsersWhoBorrowedBooks(usersWhoBorrowedBooks);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 bg-light-100 p-6 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-light-100 p-6">
      <Text className="text-dark-100 text-3xl font-semibold mb-6">
        Tableau de bord
      </Text>

      <View className="flex-col justify-between gap-6">
        {/* 1 */}
        <View className="bg-white py-3 gap-3 rounded-lg shadow-md w-auto mx-3 flex items-center justify-center">
          <Book size={32} color="#1E3A8A" />
          <Text className="text-dark-200 text-sm mt-2">Nombre de Livres</Text>
          <Text className="text-dark-100 text-2xl font-semibold">
            {numberOfBooks}
          </Text>
        </View>

        {/* Card 2*/}
        <View className="bg-white py-3 gap-3 rounded-lg shadow-md w-auto mx-3 flex items-center justify-center">
          <User size={32} color="#FACC15" />
          <Text className="text-dark-200 text-sm mt-2">
            Nombre d'Utilisateurs
          </Text>
          <Text className="text-dark-100 text-2xl font-semibold">
            {numberOfUsers}
          </Text>
        </View>

        {/* Card 3 */}
        <View className="bg-white py-3 gap-3 rounded-lg shadow-md w-auto mx-3 flex items-center justify-center">
          <FileText size={32} color="#34D399" />
          <Text className="text-dark-200 text-sm mt-2">
            Utilisateurs Ayant Emprunté
          </Text>
          <Text className="text-dark-100 text-2xl font-semibold">
            {usersWhoBorrowedBooks}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Dashboard;
