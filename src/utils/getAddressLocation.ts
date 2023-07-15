import { reverseGeocodeAsync } from 'expo-location'

type GetAddressLocation = {
  latitude: number
  longitude: number
}

export async function getAddressLocation({
  latitude,
  longitude,
}: GetAddressLocation): Promise<string | undefined> {
  try {
    const addressResponse = await reverseGeocodeAsync({ latitude, longitude })

    return addressResponse[0]?.street
  } catch (error) {
    console.log(error)
  }
}
