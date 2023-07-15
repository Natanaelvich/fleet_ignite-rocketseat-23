import { createRealmContext } from '@realm/react'
import { OpenRealmBehaviorConfiguration, OpenRealmBehaviorType } from 'realm'

import { Coords } from './schemas/Coords'
import { Historic } from './schemas/Historic'

const realmAccessBehavior: OpenRealmBehaviorConfiguration = {
  type: OpenRealmBehaviorType.OpenImmediately,
}

export const syncConfig: Partial<Realm.SyncConfiguration> = {
  flexible: true,
  newRealmFileBehavior: realmAccessBehavior,
  existingRealmFileBehavior: realmAccessBehavior,
}

export const { RealmProvider, useRealm, useQuery, useObject } =
  createRealmContext({
    schema: [Historic, Coords],
    schemaVersion: 1,
  })
