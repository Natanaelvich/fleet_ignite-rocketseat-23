import { createRealmContext } from '@realm/react'

import { Historic } from './schemas/Historic'
import { OpenRealmBehaviorConfiguration, OpenRealmBehaviorType } from 'realm'

const realmAccessBehavior: OpenRealmBehaviorConfiguration = {
  type: OpenRealmBehaviorType.OpenImmediately,
}

export const syncConfig: any = {
  flexible: true,
  newRealmFileBehavior: realmAccessBehavior,
  existingRealmFileBehavior: realmAccessBehavior,
}

export const { RealmProvider, useRealm, useQuery, useObject } =
  createRealmContext({
    schema: [Historic],
  })
