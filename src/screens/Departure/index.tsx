import { useNavigation } from '@react-navigation/native'
import { useUser } from '@realm/react'
import * as Location from 'expo-location'
import { CarSimple } from 'phosphor-react-native'
import { useEffect, useRef, useState } from 'react'
import { Alert, TextInput, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { Button } from '../../components/Button'
import { Header } from '../../components/Header'
import { LicensePlateInput } from '../../components/LicensePlateInput'
import { Loading } from '../../components/Loading'
import { LocationInfo } from '../../components/LocationInfo'
import { Map } from '../../components/Map'
import { TextAreaInput } from '../../components/TextAreaInput'
import { requestPermissionsLocationBackground } from '../../libs/location-background'
import { useRealm } from '../../libs/realm'
import { Historic } from '../../libs/realm/schemas/Historic'
import { storage } from '../../libs/storage/mmkv'
import { startLocationTask } from '../../tasks/backgroundLocationTask'
import { getAddressLocation } from '../../utils/getAddressLocation'
import { licensePlateValidate } from '../../utils/licensePlateValidate'
import { openSettings } from '../../utils/openSettings'
import { Container, Content, Message } from './styles'

type LocationObject = {
  coords: {
    latitude: number
    longitude: number
  }
}

export function Departure() {
  const { goBack } = useNavigation()
  const realm = useRealm()
  const user = useUser()

  const descriptionRef = useRef<TextInput>(null)
  const licensePlateRef = useRef<TextInput>(null)
  const [description, setDescription] = useState('')
  const [licensePlate, setLicensePlate] = useState('')
  const [isRegistering, setIsResgistering] = useState(false)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [currentAddress, setCurrentAddress] = useState<string | null>(null)
  const [location, setLocation] = useState<LocationObject | null>(null)

  const [locationBackgroundPermission, requestLocationBackgroundPermission] =
    useState<boolean>()
  const [gettingPermission, setGettingPermission] = useState<boolean>(true)

  useEffect(() => {
    ;(async () => {
      setGettingPermission(true)
      const permission = await requestPermissionsLocationBackground()

      requestLocationBackgroundPermission(permission)
      setGettingPermission(false)
    })()
  }, [])

  useEffect(() => {
    if (!locationBackgroundPermission) {
      return
    }

    let subscription: Location.LocationSubscription

    Location.watchPositionAsync(
      {
        accuracy: Location.LocationAccuracy.High,
        timeInterval: 1000,
      },
      (location) => {
        setLocation(location)
        getAddressLocation(location.coords)
          .then((address) => {
            if (address) {
              setCurrentAddress(address)
            }
          })
          .finally(() => setIsLoadingLocation(false))
      },
    ).then((response) => (subscription = response))

    return () => {
      if (subscription) {
        subscription.remove()
      }
    }
  }, [locationBackgroundPermission])

  if (!locationBackgroundPermission) {
    return (
      <Container>
        <Header title="Saída" />
        <Message>
          Você precisa permitir que o aplicativo tenha acesso a localização para
          acessar essa funcionalidade. Por favor, acesse as configurações do seu
          dispositivo para conceder a permissão ao aplicativo.
        </Message>
        <Button title="Abrir configurações" onPress={openSettings} />
      </Container>
    )
  }

  if (isLoadingLocation || gettingPermission) {
    return <Loading />
  }

  async function handleDepartureRegister() {
    try {
      if (!licensePlateValidate(licensePlate)) {
        licensePlateRef.current?.focus()
        return Alert.alert(
          'Placa inválida',
          'A placa é inválida. Por favor, informa a placa correta.',
        )
      }

      if (description.trim().length === 0) {
        descriptionRef.current?.focus()
        return Alert.alert(
          'Finalidade',
          'Por favor, informe a finalidade da utilização do veículo',
        )
      }

      if (!user) {
        return Alert.alert(
          'Erro',
          'Não foi possível identificar o usuário logado.',
        )
      }

      setIsResgistering(true)

      await startLocationTask()

      const historic = Historic.generate({
        user_id: user.id,
        license_plate: licensePlate,
        description,
        coords: [],
      })

      realm.write(() => {
        realm.create('Historic', historic)
      })

      storage.set('current_departure', historic._id.toHexString())

      Alert.alert('Saída', 'Saída do veículo registrada com sucesso.')

      goBack()
    } catch (error) {
      Alert.alert('Erro', 'Não possível registrar a saída do veículo.')
      setIsResgistering(false)
    }
  }

  return (
    <Container>
      <Header title="Saída" />

      <KeyboardAwareScrollView extraHeight={24} enableOnAndroid>
        <View>
          {location && <Map coordinates={[location.coords]} />}
          <Content>
            {currentAddress && (
              <LocationInfo
                icon={CarSimple}
                label="Localização atual"
                description={currentAddress}
              />
            )}

            <LicensePlateInput
              ref={licensePlateRef}
              label="Placa do veículo"
              placeholder="BRA1234"
              returnKeyType="next"
              onChangeText={setLicensePlate}
              onSubmitEditing={() => {
                descriptionRef.current?.focus()
              }}
            />

            <TextAreaInput
              ref={descriptionRef}
              label="Finalizade"
              placeholder="Vou utilizar o veículo para..."
              returnKeyType="send"
              blurOnSubmit
              onChangeText={setDescription}
              onSubmitEditing={handleDepartureRegister}
            />

            <Button
              title="Registar Saída"
              onPress={handleDepartureRegister}
              isLoading={isRegistering}
            />
          </Content>
        </View>
      </KeyboardAwareScrollView>
    </Container>
  )
}
