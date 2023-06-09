/* eslint-disable no-use-before-define */
import { Realm } from '@realm/react'

type GenerateProps = {
  user_id: string
  description: string
  initial_latitude: number
  initial_longitude: number
  final_latitude: number
  final_longitude: number
  license_plate: string
}

export class Historic extends Realm.Object<Historic> {
  _id!: string
  user_id!: string
  license_plate!: string
  description!: string
  status!: string
  initial_latitude!: number
  initial_longitude!: number
  final_latitude!: number
  final_longitude!: number
  created_at!: Date
  updated_at!: Date

  static generate({
    user_id,
    description,
    license_plate,
    initial_latitude,
    initial_longitude,
    final_latitude,
    final_longitude,
  }: GenerateProps) {
    return {
      _id: new Realm.BSON.UUID(),
      user_id,
      description,
      license_plate,
      initial_latitude,
      initial_longitude,
      final_latitude,
      final_longitude,
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
      initial_latitude: 'double',
      initial_longitude: 'double',
      final_latitude: 'double',
      final_longitude: 'double',
      status: 'string',
      created_at: 'date',
      updated_at: 'date',
    },
  }
}
