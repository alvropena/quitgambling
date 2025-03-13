import { Text, View, StatusBar, useColorScheme } from "react-native";

export default function Index() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: isDarkMode ? '#121212' : '#FFFFFF',
      }}
    >
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#121212' : '#FFFFFF'}
      />
      <Text
        style={{
          fontSize: 32,
          fontWeight: "bold",
          color: "#EB061C",
        }}
      >
        Quit Gambling
      </Text>
    </View>
  );
}
