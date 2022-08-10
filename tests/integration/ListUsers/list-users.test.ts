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
import Group from '@/domain/entities/group-entity'
import GroupRepository from '@/infra/repositories/group-repository'

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
]

const users2 = () => [
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
  },
  {
    userId: uuid(),
    accountId: uuid(),
    firstName: 'valid_firstName4',
    lastName: 'valid_lastName4',
    email: 'valid_email4@mail.com',
    groupId: '',
  },
  {
    userId: uuid(),
    accountId: uuid(),
    firstName: 'valid_firstName5',
    lastName: 'valid_lastName5',
    email: 'valid_email5@mail.com',
    groupId: '',
  },
  {
    userId: uuid(),
    accountId: uuid(),
    firstName: 'valid_firstName6',
    lastName: 'valid_lastName6',
    email: 'valid_email6@mail.com',
    groupId: '',
  }
]

describe('List Users', () => {
  beforeAll(async () => {
    await createDb()
    await PostgresConnection.connect()
    await queriesPostgresGroup().createTable()
    await queriesPostgresUser().createTable()
  })

  afterAll(async () => {
    await queriesPostgresUser().dropTable()
    await queriesPostgresGroup().dropTable()
    await PostgresConnection.end()
  })

  it('Should list empty array with success', async () => {
    const response = await request(app)
      .get('/api/users')
    
    expect(response.body).toEqual({ response: { body: [] } })
  })

  it('Should list users with success', async () => {
    const groupRepository = new GroupRepository()
    const requestsGroups = groups.map((group) => groupRepository.create(group))
    users[0].groupId = (await requestsGroups[0]).groupId
    users[1].groupId = (await requestsGroups[1]).groupId
    const userRepository = new UserRepository()
    const requests = users.map((user) => userRepository.create(user))
    await Promise.all(requests)
    
    const response = await request(app)
      .get('/api/users')
    
    expect(response.body).toEqual({ response: { body: users } })
    expect(response.body.response.body.length).toBe(2)
  })

  it('Should list users (page=2 & quantity = 3) with success', async () => {
    const groupRepository = new GroupRepository()
    const group = await groupRepository.create(groups[0])
    const userRepository = new UserRepository()
    
    const requests = users2().map((user) => {
      user.groupId = group.groupId
      userRepository.create(user)
    })

    await Promise.all(requests)

    const response = await request(app)
      .get('/api/users?page=2')

    expect(response.body.response.body.length).toBe(3)
  })

  it('Should list users (quantity = 5) with success', async () => {
    const groupRepository = new GroupRepository()
    const group = await groupRepository.create(groups[0])
    const userRepository = new UserRepository()
    
    const requests = users2().map((user) => {
      user.groupId = group.groupId
      userRepository.create(user)
    })

    await Promise.all(requests)

    const response = await request(app)
      .get('/api/users?page=1')
    
    expect(response.body.response.body.length).toBe(5)
  })
})