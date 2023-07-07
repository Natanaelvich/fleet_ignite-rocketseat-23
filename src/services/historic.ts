import { Realm } from '@realm/react'
import { LocationObject } from 'expo-location'
import { BSON } from 'realm'

import { Historic, LocationCoords } from '../libs/realm/schemas/Historic'
import { storage } from '../libs/storage/mmkv'

export async function addLocationsCurrentDerpature(
  locations: LocationObject[],
) {
  const currentDepartureActivity = storage.getString('current_departure')

  if (currentDepartureActivity) {
    const realm = await Realm.open({ schema: [Historic, LocationCoords] })

    const historic = realm
      .objects(Historic)
      .filtered('_id = $0', new BSON.UUID(currentDepartureActivity))[0]

    if (historic) {
      const coords = locations.map((location) => {
        return LocationCoords.generate({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        })
      })

      realm.write(() => {
        historic.locations = [...historic.locations, ...coords]
      })

      realm.close()
    }
  }
}
