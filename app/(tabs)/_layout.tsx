import { BookOpenCheck, House, UserRound } from "lucide-react-native";

import React from "react";
import { Redirect, Tabs } from "expo-router";
import { useAuth } from "@/AuthContext";

const _layout = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null; // Show loading state if needed
  if (!user) return <Redirect href="/(auth)/login" />; // Redirect to login if not authenticated

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size }) => <House size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="emprunt"
        options={{
          title: "Emprunter",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <BookOpenCheck size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <UserRound size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
