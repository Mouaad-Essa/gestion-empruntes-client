import React, { useEffect, useState } from "react";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import Constants from "expo-constants";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const UpdateBookForm = () => {
  const [bookCover, setBookCover] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    titre: "",
    auteur: "",
    description: "",
    annee_publication: "",
    genre: "",
    isbn: "",
    couverture: "",
  });

  const router = useRouter();
  const { id } = useLocalSearchParams(); // get book ID from the route

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("L'autorisation d'accéder à la galerie est requise !");
      }
    })();

    const fetchBook = async () => {
      try {
        const token = await AsyncStorage.getItem("token"); // or SecureStore if you're using it
        const response = await axios.get(`${apiUrl}/api/livre/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFormData({
          ...response.data,
          annee_publication: response.data.annee_publication?.toString() || "",
          est_emprunte: response.data.est_emprunte === 1,
        });

        setBookCover(response.data.couverture);
      } catch (error) {
        console.error("Erreur lors du chargement du livre :", error);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  const handleChange = (name: string, value: string | boolean) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0].uri;
      const base64Image = await uriToBase64(selectedImage);
      handleChange("couverture", base64Image);
      setBookCover(base64Image);
    }
  };

  const uriToBase64 = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const reader = new FileReader();
    return new Promise<string>((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${apiUrl}/api/livre/${id}`, formData);
      alert("Livre mis à jour avec succès !");
      router.back();
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-light-100 p-4"
    >
      <TouchableOpacity
        onPress={() => router.back()}
        className="flex items-center justify-center p-3 flex-row gap-2 rounded-full shadow-md my-2 w-2/5 bg-primary"
      >
        <ArrowLeft size={25} color={"#f6f6f6"} />
        <Text className="text-light-200 font-bold">Retour</Text>
      </TouchableOpacity>

      <Text className="text-2xl font-bold text-dark-100 mb-4">
        Modifier le Livre
      </Text>

      <View className="mb-4">
        <Text className="text-dark-200 text-sm">Titre</Text>
        <TextInput
          value={formData.titre}
          onChangeText={(text) => handleChange("titre", text)}
          className="p-3 border border-light-300 rounded-lg"
        />
      </View>

      <View className="mb-4">
        <Text className="text-dark-200 text-sm">Auteur</Text>
        <TextInput
          value={formData.auteur}
          onChangeText={(text) => handleChange("auteur", text)}
          className="p-3 border border-light-300 rounded-lg"
        />
      </View>

      <View className="mb-4">
        <Text className="text-dark-200 text-sm">Description</Text>
        <TextInput
          value={formData.description}
          onChangeText={(text) => handleChange("description", text)}
          multiline
          numberOfLines={4}
          className="p-3 border border-light-300 rounded-lg"
        />
      </View>

      <View className="mb-4">
        <Text className="text-dark-200 text-sm">Année de Publication</Text>
        <TextInput
          value={formData.annee_publication}
          onChangeText={(text) => handleChange("annee_publication", text)}
          keyboardType="numeric"
          className="p-3 border border-light-300 rounded-lg"
        />
      </View>

      <View className="mb-4">
        <Text className="text-dark-200 text-sm">Genre</Text>
        <TextInput
          value={formData.genre}
          onChangeText={(text) => handleChange("genre", text)}
          className="p-3 border border-light-300 rounded-lg"
        />
      </View>

      <View className="mb-4">
        <Text className="text-dark-200 text-sm">ISBN</Text>
        <TextInput
          value={formData.isbn}
          onChangeText={(text) => handleChange("isbn", text)}
          className="p-3 border border-light-300 rounded-lg"
        />
      </View>

      <View className="mb-4">
        <Text className="text-dark-200 text-sm">Couverture</Text>
        <TouchableOpacity
          onPress={handleImageUpload}
          className="p-3 border border-light-300 rounded-lg"
        >
          <Text className="text-primary">Changer l'image</Text>
        </TouchableOpacity>
        {bookCover && (
          <Image
            source={{ uri: bookCover }}
            className="w-32 h-32 mt-2 rounded-lg"
          />
        )}
      </View>

      <TouchableOpacity
        onPress={handleUpdate}
        className="bg-primary py-3 rounded-lg"
      >
        <Text className="text-light-200 text-center text-xl">
          Mettre à jour
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default UpdateBookForm;
