import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'

import * as S from './styles'

type HistoricMapProps = {
  latitude?: number
  longitude?: number
  onChange: (latitude: number, longitude: number) => void
}

const HistoricMap = ({ latitude, longitude, onChange }: HistoricMapProps) => {
  return (
    <S.Container>
      <MapView
        style={{
          width: '100%',
          height: '100%',
        }}
        provider={PROVIDER_GOOGLE}
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
        loadingEnabled
        onPress={({ nativeEvent }) => {
          onChange(
            nativeEvent.coordinate.latitude,
            nativeEvent.coordinate.longitude,
          )
        }}
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
