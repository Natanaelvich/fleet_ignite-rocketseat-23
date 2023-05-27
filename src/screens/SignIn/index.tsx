import { useEffect, useState } from 'react'
import { Realm, useApp } from '@realm/react'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'

import { Container, Title, Slogan } from './styles'

import backgroundImg from '../../assets/background.png'
import { Button } from '../../components/Button'

import { ANDROID_CLIENT_ID, IOS_CLIENT_ID } from '@env'
import { Alert } from 'react-native'

WebBrowser.maybeCompleteAuthSession()

export function SignIn() {
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const [, response, googleSignIng] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    scopes: ['profile', 'email'],
  })

  const app = useApp()

  function handleGoogleSignIn() {
    setIsAuthenticating(true)

    googleSignIng().then((response) => {
      if (response?.type !== 'success') {
        setIsAuthenticating(false)
      }
    })
  }

  useEffect(() => {
    if (response?.type === 'success') {
      if (response.authentication?.idToken) {
        const credentials = Realm.Credentials.jwt(
          response.authentication.idToken,
        )

        app.logIn(credentials).catch((error) => {
          console.log(error)
          Alert.alert(
            'Entrar',
            'Não foi possível conectar-se a sua conta google.',
          )
          setIsAuthenticating(false)
        })
      } else {
        Alert.alert(
          'Entrar',
          'Não foi possível conectar-se a sua conta google.',
        )
        setIsAuthenticating(false)
      }
    }
  }, [app, response])

  return (
    <Container source={backgroundImg}>
      <Title>Ignite Fleet</Title>

      <Slogan>Gestão de uso de veículos</Slogan>

      <Button
        title="Entrar com Google"
        onPress={handleGoogleSignIn}
        isLoading={isAuthenticating}
      />
    </Container>
  )
}
