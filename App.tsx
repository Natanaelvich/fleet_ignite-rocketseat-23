import { ThemeProvider } from 'styled-components/native'
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'

import theme from './src/theme'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { LogBox, StatusBar } from 'react-native'
import { RealmProvider, syncConfig } from './src/libs/realm'
import { AppProvider, UserProvider } from '@realm/react'
import { SignIn } from './src/screens/SignIn'

import { REALM_APP_ID } from '@env'
import { Routes } from './src/routes'
import { Loading } from './src/components/Loading'

LogBox.ignoreLogs([
  'BSON: For React Native please polyfill crypto.getRandomValues',
])

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  })

  if (!fontsLoaded) {
    return <Loading />
  }

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
            <RealmProvider sync={syncConfig} fallback={Loading}>
              <Routes />
            </RealmProvider>
          </UserProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </AppProvider>
  )
}
