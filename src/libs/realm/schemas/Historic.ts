/* eslint-disable no-use-before-define */
import { Realm } from '@realm/react'

type LocationCoordsProps = {
  latitude: number
  longitude: number
}

type GenerateProps = {
  user_id: string
  description: string
  locations: LocationCoordsProps[]
  license_plate: string
}

export class LocationCoords extends Realm.Object<LocationCoords> {
  static generate({ latitude, longitude }: LocationCoordsProps) {
    return {
      _id: new Realm.BSON.UUID(),
      latitude,
      longitude,
    }
  }

  static schema = {
    name: 'LocationCoords',
    primaryKey: '_id',

    properties: {
      _id: 'uuid',

      latitude: 'double?',
      longitude: 'double?',
    },
  }
}

export class Historic extends Realm.Object<Historic> {
  _id!: string
  user_id!: string
  license_plate!: string
  description!: string
  status!: string
  locations!: LocationCoordsProps[]
  created_at!: Date
  updated_at!: Date

  static generate({
    user_id,
    description,
    license_plate,
    locations,
  }: GenerateProps) {
    return {
      _id: new Realm.BSON.UUID(),
      user_id,
      description,
      license_plate,
      locations,
      status: 'departure',
      created_at: new Date(),
      updated_at: new Date(),
    }
  }

  static schema = {
    name: 'Historic',
    primaryKey: '_id',

    properties: {
      _id: 'uuid',
      user_id: {
        type: 'string',
        indexed: true,
      },
      license_plate: 'string',
      description: 'string',
      locations: 'LocationCoords[]',
      status: 'string',
      created_at: 'date',
      updated_at: 'date',
    },
  }
}
