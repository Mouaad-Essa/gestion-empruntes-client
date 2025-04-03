import React from "react";
import { Redirect, Tabs } from "expo-router";
import { useAuth } from "@/AuthContext";
import {
  BookCopy,
  CirclePlus,
  Home,
  UserRound,
  Users,
} from "lucide-react-native";
import { View, Text } from "react-native";
import { LibraryBig } from "lucide-react-native"; // Assuming this is your logo icon

const DashboardLayout = () => {
  const { user, isLoading } = useAuth();

  // Show loading state if data is being fetched
  if (isLoading) return null;

  // Redirect to login if user is not authenticated
  if (!user) return <Redirect href="/(auth)/login" />;

  // Redirect to home if the user is not an admin
  if (user?.role !== "admin") {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: true, // Show header for all screens
        headerTitle: user?.role,
        headerLeft: () => (
          <View className="flex flex-row ml-2 items-center">
            {/* Library Icon */}
            <LibraryBig size={25} color={"#FACC15"} />
            <Text className="text-2xl font-bold text-primary ml-1">
              E-biblio
            </Text>
          </View>
        ),
        headerRight: () => {
          return user ? (
            <Text className="text-lg font-semibold text-dark-900 mr-4">
              {user.nom}
            </Text>
          ) : null;
        },
        headerStyle: {
          backgroundColor: "#fff",
          shadowColor: "transparent",
          elevation: 0,
        },
        headerTitleAlign: "center",
      }}
    >
      {/* Dashboard Home */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />

      {/* Add Book Page (Only Admins) */}
      <Tabs.Screen
        name="books"
        options={{
          title: "livres",
          tabBarIcon: ({ color, size }) => (
            <BookCopy size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="users"
        options={{
          title: "utilisateurs",
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
        }}
      />

      {/* Profile Page */}
      <Tabs.Screen
        name="adminProfile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <UserRound size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default DashboardLayout;
