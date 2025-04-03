import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "../AuthContext"; // Import the AuthProvider and useAuth
import { StatusBar, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LibraryBig } from "lucide-react-native";
import "./globals.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: true,
              headerTitle: () => (
                <View className="flex flex-row">
                  {/* Logo Icon */}
                  <LibraryBig size={25} color={"#FACC15"} />
                  <Text className="text-2xl font-bold text-primary">
                    E-biblio
                  </Text>
                </View>
              ),
              headerRight: () => {
                const { user } = useAuth(); // Get user from context
                return user ? (
                  <Text className="text-3xl font-semibold mr-2">
                    {user.nom}
                  </Text>
                ) : null;
              },
            }}
          />
          <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
          <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
          <Stack.Screen name="livre/addBook" options={{ headerShown: false }} />
          <Stack.Screen
            name="(auth)/register"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="livre/[id]" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaView>
    </AuthProvider>
  );
}
