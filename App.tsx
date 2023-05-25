import { ThemeProvider } from "styled-components/native";
import theme from "./src/theme";
import { Home } from "./src/screens/Home";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { RealmProvider } from "./src/libs/realm";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider style={{ backgroundColor: theme.COLORS.GRAY_800 }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <RealmProvider>
          <Home />
        </RealmProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
