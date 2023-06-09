import { MMKV } from 'react-native-mmkv'

export const storage = new MMKV()

const STORAGE_ASSYNC_KEY = '@ignitefleet:last_sync'

export function saveLastSyncTimestamp() {
  const timestamp = new Date().getTime()

  storage.set(STORAGE_ASSYNC_KEY, timestamp.toString())

  return timestamp
}

export function getLastAsyncTimestamp() {
  const timestamp = storage.getString(STORAGE_ASSYNC_KEY)

  return Number(timestamp)
}
