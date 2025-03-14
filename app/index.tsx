import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StatusBar,
  useColorScheme,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage keys
const STORAGE_KEY_RECOVERY_STARTED = "quitgambling_recovery_started";
const STORAGE_KEY_LAST_PRESSED = "quitgambling_last_pressed";

export default function Index() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [lastPressed, setLastPressed] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState<string>("0d 0hrs 0min 0s");
  const [recoveryStarted, setRecoveryStarted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load saved state from AsyncStorage
  useEffect(() => {
    const loadSavedState = async () => {
      try {
        const savedRecoveryStarted = await AsyncStorage.getItem(
          STORAGE_KEY_RECOVERY_STARTED
        );
        const savedLastPressed = await AsyncStorage.getItem(
          STORAGE_KEY_LAST_PRESSED
        );

        if (savedRecoveryStarted === "true" && savedLastPressed) {
          setRecoveryStarted(true);
          setLastPressed(parseInt(savedLastPressed));
        }
      } catch (error) {
        console.error("Error loading saved state:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedState();
  }, []);

  // Save state to AsyncStorage whenever it changes
  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY_RECOVERY_STARTED,
          recoveryStarted ? "true" : "false"
        );
        if (lastPressed) {
          await AsyncStorage.setItem(
            STORAGE_KEY_LAST_PRESSED,
            lastPressed.toString()
          );
        } else {
          await AsyncStorage.removeItem(STORAGE_KEY_LAST_PRESSED);
        }
      } catch (error) {
        console.error("Error saving state:", error);
      }
    };

    if (!isLoading) {
      saveState();
    }
  }, [recoveryStarted, lastPressed, isLoading]);

  useEffect(() => {
    // Update the timer every second
    const interval = setInterval(() => {
      if (lastPressed) {
        const now = Date.now();
        const diff = now - lastPressed;

        // Calculate days, hours, minutes, seconds
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeElapsed(`${days}d ${hours}hrs ${minutes}min ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastPressed]);

  const handlePress = () => {
    if (recoveryStarted) {
      // If already in recovery mode, toggle back to initial state
      setRecoveryStarted(false);
      setLastPressed(null);
      setTimeElapsed("0d 0hrs 0min 0s");
    } else {
      // Start recovery mode
      const now = Date.now();
      setLastPressed(now);
      setRecoveryStarted(true);
    }
  };

  const warningColor = "#FF3B30"; // Warning red color
  const successColor = "#4CD964"; // Success green color
  const textColor = isDarkMode ? "#FFFFFF" : "#000000"; // Neutral text color
  const neutralBgColor = isDarkMode
    ? "rgba(100, 100, 100, 0.1)"
    : "rgba(240, 240, 240, 0.5)"; // Neutral background

  // Screen width to calculate responsive dimensions
  const screenWidth = Dimensions.get("window").width;

  // Dimensions for button and container
  const BUTTON_WIDTH = screenWidth * 0.55; // 60% of screen width
  const BUTTON_HEIGHT = screenWidth * 0.55; // Square button
  const CONTAINER_WIDTH = screenWidth * 0.85; // 90% of screen width
  const CONTAINER_HEIGHT = 120; // Fixed height for container

  // Show loading indicator while retrieving data
  if (isLoading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? "#121212" : "#FFFFFF" },
        ]}
      >
        <View style={styles.contentContainer}>
          <Text style={[styles.appTitle, { color: textColor }]}>
            QuitGambling
          </Text>
          <Text style={{ color: textColor }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#121212" : "#FFFFFF" },
      ]}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#121212" : "#FFFFFF"}
      />

      <View style={styles.contentContainer}>
        <Text style={[styles.appTitle, { color: textColor }]}>
          QuitGambling
        </Text>

        <TouchableOpacity
          style={[
            styles.circleButton,
            {
              width: BUTTON_WIDTH,
              height: BUTTON_HEIGHT,
              borderRadius: BUTTON_HEIGHT / 2,
              borderColor: recoveryStarted ? warningColor : successColor,
              backgroundColor: recoveryStarted
                ? isDarkMode
                  ? "rgba(255, 59, 48, 0.2)"
                  : "rgba(255, 59, 48, 0.1)"
                : isDarkMode
                ? "rgba(76, 217, 100, 0.2)"
                : "rgba(76, 217, 100, 0.1)",
            },
          ]}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          {recoveryStarted ? (
            <Ionicons name="warning-outline" size={80} color={warningColor} />
          ) : (
            <Ionicons name="bandage-outline" size={80} color={successColor} />
          )}
        </TouchableOpacity>

        <View
          style={[
            styles.timerContainer,
            {
              width: CONTAINER_WIDTH,
              height: CONTAINER_HEIGHT,
              backgroundColor: recoveryStarted
                ? neutralBgColor
                : isDarkMode
                ? "rgba(76, 217, 100, 0.1)"
                : "rgba(76, 217, 100, 0.05)",
            },
          ]}
        >
          <Text style={[styles.timerLabel, { color: textColor }]}>
            {recoveryStarted
              ? "Living gambling-free for"
              : "Regain control of your life"}
          </Text>
          {recoveryStarted ? (
            <Text style={[styles.timerValue, { color: textColor }]}>
              {timeElapsed}
            </Text>
          ) : (
            <Text
              style={[
                styles.timerInstructions,
                { color: isDarkMode ? successColor : "#37A34A" },
              ]}
            >
              Tap above to quit gambling
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  appTitle: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  circleButton: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
    marginBottom: 30,
  },
  timerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(150, 150, 150, 0.3)",
  },
  timerLabel: {
    fontSize: 20,
    marginBottom: 12,
    textAlign: "center",
  },
  timerValue: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  timerInstructions: {
    fontSize: 24,
    fontStyle: "italic",
    textAlign: "center",
  },
  footer: {
    width: "100%",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 12,
  },
});
