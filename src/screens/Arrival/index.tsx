import { useNavigation, useRoute } from '@react-navigation/native'
import * as Location from 'expo-location'
import { CarSimple, X } from 'phosphor-react-native'
import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { BSON } from 'realm'

import { Button } from '../../components/Button'
import { ButtonIcon } from '../../components/ButtonIcon'
import { Header } from '../../components/Header'
import { LocationInfo } from '../../components/LocationInfo'
import { Map } from '../../components/Map'
import { stopLocationBackground } from '../../libs/location-background'
import { useObject, useRealm } from '../../libs/realm'
import { Historic, LocationCoords } from '../../libs/realm/schemas/Historic'
import { getLastAsyncTimestamp } from '../../libs/storage/mmkv'
import { getAddressLocation } from '../../utils/getAddressLocation'
import {
  AsyncMessage,
  Container,
  Content,
  Description,
  Footer,
  Label,
  LicensePlate,
  SeparatorLocationInfo,
} from './styles'

type RouteParamProps = {
  id: string
}

type LocationObject = {
  coords: {
    latitude: number
    longitude: number
  }
}

export function Arrival() {
  const [dataNotSynced, setDataNotSynced] = useState(false)
  const [location, setLocation] = useState<LocationObject>()
  const [initialAdress, setInitialAdress] = useState('')
  const [finalAdress, setFinalAdress] = useState('')

  const route = useRoute()
  const { id } = route.params as RouteParamProps

  const realm = useRealm()
  const { goBack } = useNavigation()
  const historic = useObject(Historic, new BSON.UUID(id))

  const title = historic?.status === 'departure' ? 'Chegada' : 'Detalhes'

  function handleRemoveVehicleUsage() {
    Alert.alert('Cancelar', 'Cancelar a utilização do veículo?', [
      { text: 'Não', style: 'cancel' },
      { text: 'Sim', onPress: () => removeVehicleUsage() },
    ])
  }

  function removeVehicleUsage() {
    realm.write(() => {
      realm.delete(historic)
    })

    goBack()
  }

  async function handleArrivalRegister() {
    try {
      if (!historic) {
        return Alert.alert(
          'Erro',
          'Não foi possível obter os dados para registrar a chegada do veículo.',
        )
      }

      realm.write(() => {
        historic.status = 'arrival'
        historic.updated_at = new Date()
        historic.locations = [
          ...historic.locations,
          LocationCoords.generate(location?.coords),
        ]
      })

      stopLocationBackground()

      Alert.alert('Chegada', 'Chegada registrada com sucesso.')
      goBack()
    } catch (error) {
      console.log(error)
      Alert.alert('Erro', 'Não foi possível registar a chegada do veículo.')
    }
  }

  useEffect(() => {
    const lastSync = getLastAsyncTimestamp()

    setDataNotSynced(historic!.updated_at.getTime() > lastSync)
  }, [historic])

  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          'Permissão negada',
          'Para utilizar o aplicativo é necessário permitir o acesso a localização.',
        )
        return
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      })
      setLocation(currentLocation)
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      const initialAdress = await getAddressLocation({
        latitude: historic?.locations[0].latitude ?? 0,
        longitude: historic?.locations[0].longitude ?? 0,
        accuracy: 100,
        altitude: 0,
        altitudeAccuracy: 0,
        heading: 0,
        speed: 0,
      })

      setInitialAdress(initialAdress)

      const finalAdress = await getAddressLocation({
        latitude:
          historic?.locations[historic?.locations.length - 1].latitude ?? 0,
        longitude:
          historic?.locations[historic?.locations.length - 1].longitude ?? 0,
        accuracy: 100,
        altitude: 0,
        altitudeAccuracy: 0,
        heading: 0,
        speed: 0,
      })

      setFinalAdress(finalAdress)
    })()
  }, [historic?.locations])

  return (
    <Container>
      <Header title={title} />
      <Map
        coordinates={historic?.locations.map((location) => ({
          latitude: location.latitude,
          longitude: location.longitude,
        }))}
      />

      <Content>
        <LocationInfo
          icon={CarSimple}
          label="Localização da saída"
          description={initialAdress}
        />

        <SeparatorLocationInfo />

        <LocationInfo
          icon={CarSimple}
          label="Localização da chegada"
          description={finalAdress}
        />
        <Label>Placa do veículo</Label>

        <LicensePlate>{historic?.license_plate}</LicensePlate>

        <Label>Finalidade</Label>

        <Description>{historic?.description}</Description>
      </Content>

      {historic?.status === 'departure' && (
        <Footer>
          <ButtonIcon icon={X} onPress={handleRemoveVehicleUsage} />

          <Button title="Registrar chegada" onPress={handleArrivalRegister} />
        </Footer>
      )}

      {dataNotSynced && (
        <AsyncMessage>
          Sincronização da{' '}
          {historic?.status === 'departure' ? 'partida' : 'chegada'} pendente
        </AsyncMessage>
      )}
    </Container>
  )
}
