import { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import COLORS from "../constants/colors";
import { Image } from "expo-image";

export default function SplashScreen() {
  const [uri, setUri] = useState("");
  const intervalRef = useRef(null);
  const opacity = useRef(new Animated.Value(0)).current;

  const changeImage = () => {
    const randomNum = Math.floor(Math.random() * 1000);
    const newUri = `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${randomNum}`;
    setUri(newUri);
  };

  const checkTokenAndRedirect = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      router.replace("(tabs)");
    } else {
      router.replace("(auth)");
    }
  };

  useEffect(() => {
    // Start fade-in
    Animated.timing(opacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Start image changing
    changeImage(); // initial image
    intervalRef.current = setInterval(changeImage, 700); // change every 700ms

    // Navigate after 3 seconds
    const timeout = setTimeout(() => {
      clearInterval(intervalRef.current);
      checkTokenAndRedirect();
    }, 3000);

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ alignItems: "center", opacity }}>
        <Image
          source={{ uri }}
          style={styles.logo}
          contentFit="contain"
        />
        <Text style={styles.title}>Bookish 📚</Text>
        <Text style={styles.subtitle}>Discover and share your favorite books</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
