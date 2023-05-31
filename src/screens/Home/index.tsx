import { useCallback, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import Toast from 'react-native-toast-message'
import { HistoricCard, HistoricCardProps } from '../../components/HistoricCard'
import { HomeHeader } from '../../components/HomeHeader'
import { useQuery, useRealm } from '../../libs/realm'
import { Historic } from '../../libs/realm/schemas/Historic'

import { Container, Content, Label, Title } from './styles'
import { Alert, FlatList, ViewToken } from 'react-native'
import { CarStatus } from '../../components/CarStatus'
import { useNavigation } from '@react-navigation/native'
import { Realm, useUser } from '@realm/react'
import {
  getLastAsyncTimestamp,
  saveLastSyncTimestamp,
} from '../../libs/asyncStorage/syncStorage'
import { TopMessage } from '../../components/TopMessage'
import { CloudArrowUp } from 'phosphor-react-native'
import { useSharedValue } from 'react-native-reanimated'

export function Home() {
  const { navigate } = useNavigation()

  const [vehicleHistoric, setVehicleHistoric] = useState<HistoricCardProps[]>(
    [],
  )
  const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null)
  const [percetageToSync, setPercentageToSync] = useState<string | null>(null)

  const viewableItems = useSharedValue<ViewToken[]>([])

  const historic = useQuery(Historic)
  const realm = useRealm()
  const user = useUser()

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

  const fetchHistoric = useCallback(async () => {
    try {
      const response = historic.filtered(
        "status='arrival' SORT(created_at DESC)",
      )

      const lastSync = await getLastAsyncTimestamp()

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

  const progressNotification = useCallback(
    async (transferred: number, transferable: number) => {
      const percentage = (transferred / transferable) * 100

      if (percentage === 100) {
        await saveLastSyncTimestamp()
        await fetchHistoric()
        setPercentageToSync(null)

        Toast.show({
          type: 'info',
          text1: 'Todos os dados estão sincronizado.',
        })
      }

      if (percentage < 100) {
        setPercentageToSync(`${percentage.toFixed(0)}% sincronizado.`)
      }
    },
    [fetchHistoric],
  )

  useEffect(() => {
    const syncSession = realm.syncSession

    if (!syncSession) {
      return
    }

    syncSession.addProgressNotification(
      Realm.ProgressDirection.Upload,
      Realm.ProgressMode.ReportIndefinitely,
      progressNotification,
    )

    return () => {
      syncSession.removeProgressNotification(progressNotification)
    }
  }, [progressNotification, realm])

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

      mutableSubs.add(historicByUserQuery, { name: 'hostoric_by_user' })
    })
  }, [realm, user])

  return (
    <Container>
      {percetageToSync && (
        <TopMessage title={percetageToSync} icon={CloudArrowUp} />
      )}

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
              viewableItems={viewableItems}
            />
          )}
          onViewableItemsChanged={(info) => {
            viewableItems.value = info.viewableItems
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={<Label>Nenhum registro de utilização.</Label>}
        />
      </Content>
    </Container>
  )
}
