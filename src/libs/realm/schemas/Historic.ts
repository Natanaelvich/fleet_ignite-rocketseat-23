/* eslint-disable no-use-before-define */
import { Realm } from '@realm/react'

type GenerateProps = {
  user_id: string
  description: string
  coordinates: {
    initial: {
      latitude: number
      longitude: number
    }
    final: {
      latitude: number
      longitude: number
    }
  }
  license_plate: string
}

export class Historic extends Realm.Object<Historic> {
  _id!: string
  user_id!: string
  license_plate!: string
  description!: string
  status!: string
  coordinates!: {
    initial: {
      latitude: number
      longitude: number
    }
    final: {
      latitude: number
      longitude: number
    }
  }

  created_at!: Date
  updated_at!: Date

  static generate({
    user_id,
    description,
    license_plate,
    coordinates,
  }: GenerateProps) {
    return {
      _id: new Realm.BSON.UUID(),
      user_id,
      description,
      license_plate,
      coordinates,
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
      coordinates: {
        type: 'object',
        properties: {
          initial: {
            type: 'object',
            properties: {
              latitude: 'double',
              longitude: 'double',
            },
          },
          final: {
            type: 'object',
            properties: {
              latitude: 'double',
              longitude: 'double',
            },
          },
        },
      },
      status: 'string',
      created_at: 'date',
      updated_at: 'date',
    },
  }
}
