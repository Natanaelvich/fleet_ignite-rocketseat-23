import { Car } from 'phosphor-react-native'
import MapView, {
  LatLng,
  MapViewProps,
  Marker,
  PROVIDER_GOOGLE,
} from 'react-native-maps'

import { IconBox } from '../IconBox'

type Props = MapViewProps & {
  coordinates: LatLng[]
}

export function Map({ coordinates, ...rest }: Props) {
  const lastCoordinate = coordinates[coordinates.length - 1]

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={{ width: '100%', height: 200 }}
      region={{
        latitude: lastCoordinate.latitude,
        longitude: lastCoordinate.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
      {...rest}
    >
      <Marker coordinate={coordinates[0]}>
        <IconBox size="SMALL" icon={Car} />
      </Marker>
    </MapView>
  )
}
