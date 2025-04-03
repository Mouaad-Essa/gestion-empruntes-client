import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { Plus, User } from "lucide-react-native"; // Import Lucide Icon
import { useRouter } from "expo-router"; // Import useRouter from Expo

const Users = () => {
  // Static array of users to simulate the data
  const users = [
    {
      id: 1,
      nom: "John Doe",
      email: "johndoe@example.com",
      role: "utilisateur",
    },
    { id: 2, nom: "Jane Smith", email: "janesmith@example.com", role: "admin" },
    {
      id: 3,
      nom: "Alice Johnson",
      email: "alice@example.com",
      role: "utilisateur",
    },
    { id: 4, nom: "Bob Brown", email: "bob@example.com", role: "admin" },
    // Add more users as needed to test scrolling
  ];

  const router = useRouter(); // Initialize useRouter hook

  // Handle navigation to the add user screen
  const handleNavigateToAddUser = () => {
    router.push("../users/addUser"); // Navigate to Add User screen
  };

  // Handle navigation to the update user screen
  const handleNavigateToUpdateUser = (id: number) => {
    router.push(`../users/${id}`); // Navigate to Update User screen
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

      {/* Scrollable List of Users */}
      <ScrollView className="flex gap-3 ">
        {users.map((user) => (
          <View
            key={user.id}
            className=" bg-white p-4 mb-3 rounded-lg shadow-md flex-row justify-between items-center"
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
                <Text className="text-white">Update</Text>
              </TouchableOpacity>
              {/* Delete Button */}
              <TouchableOpacity className="bg-red-500 p-2 rounded-lg">
                <Text className="text-white">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Users;
