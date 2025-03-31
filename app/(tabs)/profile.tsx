import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../AuthContext"; // Assuming you're using AuthContext

const ProfileScreen = () => {
  const { user, logout, isLoading } = useAuth(); // Get user info, logout function, and loading state from context
  const [token, setToken] = useState<string | null>(null); // Local state for storing token
  const router = useRouter();

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      setToken(storedToken); // Set token state to the value in AsyncStorage
    };
    getToken();
  }, []);

  const handleLogout = async () => {
    // Clear the user session
    await logout(); // This will clear the token from AsyncStorage and update the user state

    // Redirect to the login screen
    router.replace("/(auth)/login"); // Redirect to login
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />; // Show loading indicator while data is being loaded
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Profile Information
      </Text>

      {/* Display User Information */}
      {user ? (
        <View>
          <Text>{user.id}</Text>
          <Text>{user.role}</Text>
        </View>
      ) : (
        <Text>No user data available</Text>
      )}

      {/* Display Token */}
      {token ? (
        <View>
          <Text>{token}</Text>
        </View>
      ) : (
        <Text>No token found</Text>
      )}

      {/* Logout Button */}
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default ProfileScreen;
