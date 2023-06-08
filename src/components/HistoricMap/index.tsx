import { Platform } from 'react-native'
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps'

import * as S from './styles'

type HistoricMapProps = {
  latitude?: number
  longitude?: number
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
        region={
          latitude && longitude
            ? {
                latitude,
                longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }
            : undefined
        }
        showsUserLocation
        showsMyLocationButton
        loadingEnabled
      >
        {latitude && longitude && (
          <Marker
            coordinate={{
              latitude,
              longitude,
            }}
          />
        )}
      </MapView>
    </S.Container>
  )
}

export default HistoricMap
