/**
 * @jest-environment ./tests/integration/config/jest-environment/pg-environment.ts
*/

import request from 'supertest'
import { v4 as uuid } from 'uuid'

import app from '@/main/express/app'
import PostgresConnection, { createDb } from '@/infra/database/connection'
import queriesPostgresUser from '@/infra/helpers/queries-postgres-user'
import UserRepository from '@/infra/repositories/user-repository'
import queriesPostgresGroup from '@/infra/helpers/queries-postgres-group'
import GroupRepository from '@/infra/repositories/group-repository'
import Group from '@/domain/entities/group-entity'

jest.setTimeout(15000)

const groups: Omit<Group, 'groupId'>[] = [
  {
    groupName: 'grupo1',
    groupDescription: undefined
  },
  {
    groupName: 'grupo2',
    groupDescription: 'O GRUPO 2'
  },
]

const users = [
  {
    userId: uuid(),
    accountId: uuid(),
    firstName: 'valid_firstName',
    lastName: 'valid_lastName',
    email: 'valid_email@mail.com',
    groupId: '',
  },
  {
    userId: uuid(),
    accountId: uuid(),
    firstName: 'valid_firstName2',
    lastName: 'valid_lastName2',
    email: 'valid_email2@mail.com',
    groupId: '',
  },
  {
    userId: uuid(),
    accountId: uuid(),
    firstName: 'valid_firstName3',
    lastName: 'valid_lastName3',
    email: 'valid_email3@mail.com',
    groupId: '',
  }
]

describe('Find Users By Group', () => {
  beforeAll(async () => {
    await PostgresConnection.connect()
    await createDb()
    await queriesPostgresGroup().createTable()
    await queriesPostgresUser().createTable()
  })

  afterAll(async () => {
    await queriesPostgresUser().dropTable()
    await queriesPostgresGroup().dropTable()
    await PostgresConnection.end()
  })

  it('Should list users with success', async () => {
    const groupRepository = new GroupRepository()
    const requestsGroups = groups.map((group) => groupRepository.create(group))
    users[0].groupId = (await requestsGroups[0]).groupId
    users[1].groupId = (await requestsGroups[1]).groupId
    users[2].groupId = (await requestsGroups[1]).groupId
    const userRepository = new UserRepository()
    const requests = users.map((user) => userRepository.create(user))
    await Promise.all(requests)

    const response = await request(app)
      .get(`/api/users/${users[1].groupId}`)

    const [_user1, user2, user3] = users
    
    expect(response.body.response.body).toEqual([user2, user3])
  })
})