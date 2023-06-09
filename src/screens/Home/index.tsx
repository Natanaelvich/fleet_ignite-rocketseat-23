import { useNavigation } from '@react-navigation/native'
import { Realm, useUser } from '@realm/react'
import dayjs from 'dayjs'
import { useCallback, useEffect, useState } from 'react'
import { Alert, FlatList, RefreshControl } from 'react-native'

import { CarStatus } from '../../components/CarStatus'
import { HistoricCard, HistoricCardProps } from '../../components/HistoricCard'
import { HomeHeader } from '../../components/HomeHeader'
import { useQuery, useRealm } from '../../libs/realm'
import { Historic } from '../../libs/realm/schemas/Historic'
import { getLastAsyncTimestamp } from '../../libs/storage/mmkv'
import { Container, Content, Label, Title } from './styles'

let realmConnection: Realm | null = null

export function Home() {
  const { navigate } = useNavigation()

  const [vehicleHistoric, setVehicleHistoric] = useState<HistoricCardProps[]>(
    [],
  )
  const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null)

  const historic = useQuery(Historic)
  const realm = useRealm()

  const user = useUser()

  useEffect(() => {
    realmConnection = realm
  }, [realm])

  function handleRegisterMoviment() {
    if (vehicleInUse?._id) {
      navigate('arrival', { id: vehicleInUse._id.toString() })
    } else {
      navigate('departure')
    }
  }

  function handleHistoricDetails(id: string) {
    navigate('arrival', { id })
  }

  const fetchVehicleInUse = useCallback(() => {
    try {
      const vehicle = historic.filtered("status='departure'")[0]
      setVehicleInUse(vehicle)
    } catch (error) {
      Alert.alert(
        'Veículo em uso',
        'Não foi possível carregar o veículo em uso.',
      )
      console.log(error)
    }
  }, [historic])

  const fetchHistoric = useCallback(() => {
    try {
      const response = historic.filtered(
        "status='arrival' SORT(created_at DESC)",
      )

      const lastSync = getLastAsyncTimestamp()

      const formattedHistoric = response.map((item) => {
        return {
          id: item._id.toString(),
          licensePlate: item.license_plate,
          isSync: lastSync > item.updated_at!.getTime(),
          created: dayjs(item.created_at).format(
            '[Saída em] DD/MM/YYYY [às] HH:mm',
          ),
        }
      })
      setVehicleHistoric(formattedHistoric)
    } catch (error) {
      console.log(error)
      Alert.alert('Histórico', 'Não foi possível carregar o histórico.')
    }
  }, [historic])

  useEffect(() => {
    fetchHistoric()
  }, [fetchHistoric])

  useEffect(() => {
    fetchVehicleInUse()
  }, [fetchVehicleInUse])

  useEffect(() => {
    realm.addListener('change', () => fetchVehicleInUse())
    return () => {
      if (realm && !realm.isClosed) {
        realm.removeListener('change', fetchVehicleInUse)
      }
    }
  }, [fetchVehicleInUse, realm])

  useEffect(() => {
    realm.subscriptions.update((mutableSubs, realm) => {
      const historicByUserQuery = realm
        .objects('Historic')
        .filtered(`user_id = '${user!.id}'`)

      const locationCoords = realm.objects('LocationCoords')
      mutableSubs.add(historicByUserQuery, { name: 'hostoric_by_user' })
      mutableSubs.add(locationCoords, { name: 'location_coords' })
    })
  }, [realm, user])

  return (
    <Container>
      <HomeHeader />

      <Content>
        <CarStatus
          licensePlate={vehicleInUse?.license_plate}
          onPress={handleRegisterMoviment}
        />

        <Title>Histórico</Title>

        <FlatList
          data={vehicleHistoric}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HistoricCard
              data={item}
              onPress={() => handleHistoricDetails(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={<Label>Nenhum registro de utilização.</Label>}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={fetchHistoric} />
          }
        />
      </Content>
    </Container>
  )
}

export function getRealmConnection() {
  return realmConnection
}
