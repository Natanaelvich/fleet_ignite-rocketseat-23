import { useNavigation, useRoute } from '@react-navigation/native'
import dayjs from 'dayjs'
import { CarSimple, X } from 'phosphor-react-native'
import { useCallback, useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { LatLng } from 'react-native-maps'
import { BSON } from 'realm'

import { Button } from '../../components/Button'
import { ButtonIcon } from '../../components/ButtonIcon'
import { Header } from '../../components/Header'
import { Loading } from '../../components/Loading'
import { LocationInfo, LocationInfoProps } from '../../components/LocationInfo'
import { Locations } from '../../components/Locations'
import { Map } from '../../components/Map'
import { getStorageLocations } from '../../libs/asyncStorage/locationStorage'
import { useObject, useRealm } from '../../libs/realm'
import { Historic } from '../../libs/realm/schemas/Historic'
import { getLastAsyncTimestamp } from '../../libs/storage/mmkv'
import { stopLocationTask } from '../../tasks/backgroundLocationTask'
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

export function Arrival() {
  const [dataNotSynced, setDataNotSynced] = useState(false)
  const [initialAdress, setInitialAdress] = useState('')
  const [finalAdress, setFinalAdress] = useState('')
  const [coordinates, setCoordinates] = useState<LatLng[]>([])
  const [departure, setDeparture] = useState<LocationInfoProps>(
    {} as LocationInfoProps,
  )
  const [arrival, setArrival] = useState<LocationInfoProps | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  async function removeVehicleUsage() {
    realm.write(() => {
      realm.delete(historic)
    })

    await stopLocationTask()
  }

  async function handleArrivalRegister() {
    try {
      if (!historic) {
        return Alert.alert(
          'Erro',
          'Não foi possível obter os dados para registrar a chegada do veículo.',
        )
      }

      const coords = await getStorageLocations()

      realm.write(() => {
        historic.status = 'arrival'
        historic.updated_at = new Date()
        historic.coords.push(...coords)
      })

      await stopLocationTask()

      Alert.alert('Chegada', 'Chegada registrada com sucesso.')
      goBack()
    } catch (error) {
      console.log(error)
      Alert.alert('Erro', 'Não foi possível registar a chegada do veículo.')
    }
  }

  const getLocationsInfo = useCallback(async () => {
    if (!historic) {
      return
    }

    const lastSync = await getLastAsyncTimestamp()
    const updatedAt = historic.updated_at.getTime()
    setDataNotSynced(updatedAt > lastSync)

    if (historic?.status === 'departure') {
      const locationsStorage = await getStorageLocations()
      setCoordinates(locationsStorage)
    } else {
      setCoordinates(historic?.coords ?? [])
    }

    if (historic?.coords[0]) {
      const departureStreetName = await getAddressLocation(historic?.coords[0])

      setDeparture({
        label: `Saíndo em ${departureStreetName ?? ''}`,
        description: dayjs(new Date(historic?.coords[0].timestamp)).format(
          'DD/MM/YYYY [às] HH:mm',
        ),
      })
    }

    if (historic?.status === 'arrival') {
      const lastLocation = historic.coords[historic.coords.length - 1]
      const arrivalStreetName = await getAddressLocation(lastLocation)

      setArrival({
        label: `Chegando em ${arrivalStreetName ?? ''}`,
        description: dayjs(new Date(lastLocation.timestamp)).format(
          'DD/MM/YYYY [às] HH:mm',
        ),
      })
    }

    setIsLoading(false)
  }, [historic])

  useEffect(() => {
    getLocationsInfo()
  }, [getLocationsInfo])

  useEffect(() => {
    ;(async () => {
      const initialAdress = await getAddressLocation({
        latitude: historic?.coords[0].latitude ?? 0,
        longitude: historic?.coords[0].longitude ?? 0,
      })

      setInitialAdress(initialAdress)

      const finalAdress = await getAddressLocation({
        latitude: historic?.coords[historic?.coords.length - 1].latitude ?? 0,
        longitude: historic?.coords[historic?.coords.length - 1].longitude ?? 0,
      })

      setFinalAdress(finalAdress)
    })()
  }, [historic?.coords])

  if (isLoading) {
    return <Loading />
  }

  return (
    <Container>
      <Header title={title} />
      {coordinates.length > 0 && <Map coordinates={coordinates} />}

      <Content>
        <Locations departure={departure} arrival={arrival} />
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
