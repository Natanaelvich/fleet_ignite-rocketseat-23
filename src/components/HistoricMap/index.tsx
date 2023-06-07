import { Platform } from 'react-native'
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps'

import * as S from './styles'

type HistoricMapProps = {
  latitude: number
  longitude: number
}

const HistoricMap = ({ latitude, longitude }: HistoricMapProps) => {
  return (
    <S.Container>
      <MapView
        style={{
          width: '100%',
          height: '100%',
        }}
        provider={
          Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
        }
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }}
      />
    </S.Container>
  )
}

export default HistoricMap
