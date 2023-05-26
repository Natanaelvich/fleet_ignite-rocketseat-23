import { ThemeProvider } from "styled-components/native";
import theme from "./src/theme";
import { Home } from "./src/screens/Home";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { RealmProvider } from "./src/libs/realm";
import { AppProvider, UserProvider } from "@realm/react";
import { SignIn } from "./src/screens/SignIn";

import { REALM_APP_ID } from "@env";
import { Routes } from "./src/routes";

export default function App() {
  return (
    <AppProvider id={REALM_APP_ID}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider style={{ backgroundColor: theme.COLORS.GRAY_800 }}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />
          <UserProvider fallback={SignIn}>
            <RealmProvider>
              <Routes />
            </RealmProvider>
          </UserProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </AppProvider>
  );
}
