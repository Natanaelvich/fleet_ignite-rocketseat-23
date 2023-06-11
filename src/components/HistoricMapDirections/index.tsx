import { GOOGLE_MAPS_DIRECTION_API_KEY } from '@env'
import { useEffect, useRef, useState } from 'react'
import { Platform } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'

import * as S from './styles'

type HistoricMapDirectionsProps = {
  origin: {
    latitude: number
    longitude: number
  }
  destination: {
    latitude: number
    longitude: number
  }
}

const HistoricMapDirections = ({
  origin,
  destination,
}: HistoricMapDirectionsProps) => {
  const mapRef = useRef<MapView>(null)
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    if (mapReady) {
      mapRef.current?.fitToCoordinates([origin, destination], {
        edgePadding: {
          right: 30,
          left: 30,
          top: 30,
          bottom: 30,
        },
      })

      // ios fix center position
      if (Platform.OS === 'ios') {
        mapRef.current?.setCamera({
          center: {
            latitude: (origin.latitude + destination.latitude) / 2,
            longitude: (origin.longitude + destination.longitude) / 2,
          },
          pitch: 0,
          heading: 0,
          zoom: 15,
        })
      }
    }
  }, [destination, mapReady, origin])

  return (
    <S.Container>
      <MapView
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%',
        }}
        provider={PROVIDER_GOOGLE}
        loadingEnabled
        onMapReady={() => setMapReady(true)}
      >
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={GOOGLE_MAPS_DIRECTION_API_KEY}
        />

        <Marker coordinate={origin} />
        <Marker coordinate={destination} />
      </MapView>
    </S.Container>
  )
}

export default HistoricMapDirections
