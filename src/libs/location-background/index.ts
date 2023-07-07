import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'
import Realm, { BSON } from 'realm'

import { Historic, LocationCoords } from '../realm/schemas/Historic'
import { storage } from '../storage/mmkv'

const LOCATION_TASK_NAME = 'background-location-task'

export const requestPermissionsLocationBackground = async () => {
  let statusSatisfied = false

  console.log('requestPermissionsLocationBackground')

  const { status: foregroundStatus } =
    await Location.requestForegroundPermissionsAsync()
  if (foregroundStatus === 'granted') {
    console.log('foregroundStatus granted')
    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync()
    console.log(backgroundStatus)
    if (backgroundStatus === 'granted') {
      statusSatisfied = true
    }
  }

  return statusSatisfied
}

export const startLocationBackground = async () => {
  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.Balanced,
    showsBackgroundLocationIndicator: true,
  })
}

export const stopLocationBackground = async () => {
  await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME)
}

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    return
  }
  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] }

    const currentDepartureActivity = storage.getString('current_departure')
    console.log(currentDepartureActivity)
    console.log(locations)

    if (currentDepartureActivity) {
      const realm = new Realm({ schema: [Historic, LocationCoords] })
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
          historic.locations.push(...coords)
        })

        realm.close()
      }
    }
    // do something with the locations captured in the background
  }
})
