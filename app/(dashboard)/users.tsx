import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const Users = () => {
  const [users, setUsers] = useState<any[]>([]);
  const router = useRouter();

  // Fetch users
  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs", error);
    }
  };

  //fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle navigation to the Add User
  const handleNavigateToAddUser = () => {
    router.push("../users/addUser");
  };

  // Handle navigation to the Update User
  const handleNavigateToUpdateUser = (id: number) => {
    router.push(`../users/updateUser/${id}`);
  };

  // Handle Delete User
  const handleDeleteUser = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(`${apiUrl}/api/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsers(); // Re-fetch
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur", error);
    }
  };

  return (
    <View className="flex-1 bg-light-100 p-6">
      <Text className="text-dark-100 text-3xl font-semibold mb-6">
        Liste des Utilisateurs
      </Text>

      {/* Add User Button */}
      <TouchableOpacity
        onPress={handleNavigateToAddUser}
        className="absolute top-6 right-6 bg-primary p-3 rounded-full"
      >
        <Plus size={24} color="white" />
      </TouchableOpacity>

      <ScrollView className="flex gap-3 ">
        {users.map((user) => (
          <View
            key={user.id}
            className="bg-white p-4 mb-3 rounded-lg shadow-md flex-row justify-between items-center"
          >
            <View>
              <Text className="text-dark-100 font-semibold">{user.nom}</Text>
              <Text className="text-dark-200">{user.email}</Text>
              <Text className="text-dark-300">{user.role}</Text>
            </View>
            <View className="flex-row space-x-4 gap-3">
              {/* Update Button */}
              <TouchableOpacity
                onPress={() => handleNavigateToUpdateUser(user.id)}
                className="bg-secondary p-2 rounded-lg "
              >
                <Text className="text-dark-100">Update</Text>
              </TouchableOpacity>
              {/* Delete Button */}
              <TouchableOpacity
                onPress={() => {
                  // Confirmation
                  Alert.alert(
                    "Supprimer l'utilisateur",
                    `Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.nom}?`,
                    [
                      { text: "Annuler", style: "cancel" },
                      {
                        text: "Supprimer",
                        onPress: () => handleDeleteUser(user.id),
                        style: "destructive",
                      },
                    ]
                  );
                }}
                className="bg-red-500 p-2 rounded-lg"
              >
                <Text className="text-dark-100">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Users;
