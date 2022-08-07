/**
 * @jest-environment ./tests/integration/config/jest-environment/pg-environment.ts
*/

import request from 'supertest'
import { v4 as uuid } from 'uuid'

import app from '@/main/express/app'
import PostgresConnection from '@/infra/database/connection'
import queriesPostgresUser from '@/infra/helpers/queries-postgres-user'
import UserRepository from '@/infra/repositories/user-repository'
import queriesPostgresGroup from '@/infra/helpers/queries-postgres-group'
import GroupRepository from '@/infra/repositories/group-repository'
import Group from '@/domain/entities/group-entity'

jest.setTimeout(15000)

const createDatabase = async () => {
  PostgresConnection.query('CREATE DATABASE cosmo_database_test')
    .catch((error) => error)
}

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
  }
]

describe('Delete Users', () => {
  beforeAll(async () => {
    await createDatabase()
    await PostgresConnection.connect()
    await queriesPostgresGroup().createTable()
    await queriesPostgresUser().createTable()
  })

  afterAll(async () => {
    await queriesPostgresUser().dropTable()
    await queriesPostgresGroup().dropTable()
    await PostgresConnection.end()
  })

  it('Should delete user with success', async () => {
    const groupRepository = new GroupRepository()
    const requestsGroups = groups.map((group) => groupRepository.create(group))
    users[0].groupId = (await requestsGroups[0]).groupId
    users[1].groupId = (await requestsGroups[1]).groupId
    const userRepository = new UserRepository()
    const requests = users.map((user) => userRepository.create(user))
    const responses = await Promise.all(requests)
    
    const response = await request(app)
      .delete(`/api/users/${responses[0].userId}`)
    
    const allUsers = await userRepository.list()
    
    expect(response.body).toEqual({})
    expect(allUsers.length).toBe(1)
  })
})