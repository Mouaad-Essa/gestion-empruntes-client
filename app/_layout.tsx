import { Stack } from "expo-router";
import { AuthProvider } from "../AuthContext"; // Import the AuthProvider
import "./globals.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
        <Stack.Screen name="livre/[id]" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
