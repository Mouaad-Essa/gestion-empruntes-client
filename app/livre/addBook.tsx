import React, { useState, useEffect } from "react";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Image,
  Switch,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker"; // Import the image picker
import axios from "axios";
import Constants from "expo-constants";
import { ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const AddBookForm = () => {
  const [bookCover, setBookCover] = useState<string | null>(null); // Image as Base64
  const router = useRouter();
  const [formData, setFormData] = useState({
    titre: "",
    auteur: "",
    description: "",
    annee_publication: "",
    genre: "",
    isbn: "",
    est_emprunte: false,
    couverture: "",
  });

  // Request permission to access media library (important for expo)
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access media library is required!");
      }
    })();
  }, []);

  const handleChange = (name: string, value: string | boolean) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to handle image picking
  const handleImageUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only pick images
      allowsEditing: true, // Allow user to crop or edit the image
      aspect: [4, 3], // Optional: Aspect ratio
      quality: 1, // Optional: Image quality (1 = high quality)
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0].uri; // Access URI of selected image
      const base64Image = await uriToBase64(selectedImage); // Convert the URI to Base64
      handleChange("couverture", base64Image);
      setBookCover(base64Image); // Save the image as base64 string
    }
  };

  // Convert image URI to Base64
  const uriToBase64 = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const reader = new FileReader();
    return new Promise<string>((resolve, reject) => {
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/livre`, formData);
      console.log(response.data); // Handle success (show message, navigate, etc.)
    } catch (error) {
      console.error(error); // Handle error (show error message)
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-light-100 p-4"
    >
      <TouchableOpacity
        onPress={() => router.back()}
        className="flex items-center justify-center p-3 
            flex-row gap-2 rounded-full shadow-md
            my-2
            w-2/5
            bg-primary"
      >
        <ArrowLeft size={25} color={"#f6f6f6"} />
        <Text className="text-light-200 font-bold">Retour</Text>
      </TouchableOpacity>
      <Text className="text-2xl font-bold text-dark-100 mb-4">
        Ajouter un Livre
      </Text>

      {/* Book Title */}
      <View className="mb-4">
        <Text className="text-dark-200 text-sm">Titre</Text>
        <TextInput
          value={formData.titre}
          onChangeText={(text) => handleChange("titre", text)}
          placeholder="Entrez le titre du livre"
          className="p-3 border border-light-300 rounded-lg"
        />
      </View>

      {/* Author */}
      <View className="mb-4">
        <Text className="text-dark-200 text-sm">Auteur</Text>
        <TextInput
          value={formData.auteur}
          onChangeText={(text) => handleChange("auteur", text)}
          placeholder="Entrez l'auteur du livre"
          className="p-3 border border-light-300 rounded-lg"
        />
      </View>

      {/* Description */}
      <View className="mb-4">
        <Text className="text-dark-200 text-sm">Description</Text>
        <TextInput
          value={formData.description}
          onChangeText={(text) => handleChange("description", text)}
          placeholder="Entrez la description du livre"
          multiline
          numberOfLines={4}
          className="p-3 border border-light-300 rounded-lg"
        />
      </View>

      {/* Publication Year */}
      <View className="mb-4">
        <Text className="text-dark-200 text-sm">Année de Publication</Text>
        <TextInput
          value={formData.annee_publication}
          onChangeText={(text) => handleChange("annee_publication", text)}
          placeholder="Entrez l'année de publication"
          keyboardType="numeric"
          className="p-3 border border-light-300 rounded-lg"
        />
      </View>

      {/* Genre */}
      <View className="mb-4">
        <Text className="text-dark-200 text-sm">Genre</Text>
        <TextInput
          value={formData.genre}
          onChangeText={(text) => handleChange("genre", text)}
          placeholder="Entrez le genre du livre"
          className="p-3 border border-light-300 rounded-lg"
        />
      </View>

      {/* ISBN */}
      <View className="mb-4">
        <Text className="text-dark-200 text-sm">ISBN</Text>
        <TextInput
          value={formData.isbn}
          onChangeText={(text) => handleChange("isbn", text)}
          placeholder="Entrez l'ISBN du livre"
          className="p-3 border border-light-300 rounded-lg"
        />
      </View>

      {/* Availability */}
      <View className="mb-4 flex-row items-center">
        <Text className="text-dark-200 text-sm mr-2">Est-il emprunté ?</Text>
        <Switch
          value={formData.est_emprunte}
          onValueChange={(value) => handleChange("est_emprunte", value)}
          trackColor={{ false: "#ccc", true: "#3b82f6" }}
          thumbColor="#fff"
        />
      </View>

      {/* Cover Upload */}
      <View className="mb-4">
        <Text className="text-dark-200 text-sm">Couverture</Text>
        <TouchableOpacity
          onPress={handleImageUpload} // Call the image picker here
          className="p-3 border border-light-300 rounded-lg"
        >
          <Text className="text-primary">Choisir une image</Text>
        </TouchableOpacity>
        {bookCover && (
          <Image
            source={{ uri: bookCover }}
            className="w-32 h-32 mt-2 rounded-lg"
          />
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-primary py-3 rounded-lg
       
        "
      >
        <Text className=" text-light-200 text-center text-xl">
          Ajouter le Livre
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddBookForm;
