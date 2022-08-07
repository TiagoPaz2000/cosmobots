/**
 * @jest-environment ./tests/integration/config/jest-environment/pg-environment.ts
*/

import request from 'supertest'
import { v4 as uuid } from 'uuid'

import app from '@/main/express/app'
import PostgresConnection from '@/infra/database/connection'
import queriesPostgresUser from '@/infra/helpers/queries-postgres-user'
import UserRepository from '@/infra/repositories/user-repository'

jest.setTimeout(15000)

const createDatabase = async () => {
  PostgresConnection.query('CREATE DATABASE cosmo_database_test')
    .catch((error) => error)
}

const users = [
  {
    userId: uuid(),
    accountId: uuid(),
    firstName: 'valid_firstName',
    lastName: 'valid_lastName',
    email: 'valid_email@mail.com',
    groupId: 'f00af341-655c-4763-a46e-01e42cc69d1f',
  },
  {
    userId: uuid(),
    accountId: uuid(),
    firstName: 'valid_firstName2',
    lastName: 'valid_lastName2',
    email: 'valid_email2@mail.com',
    groupId: '9c3af0d1-4203-428e-9951-e1873f14bb21',
  }
]

describe('List Users', () => {
  beforeAll(async () => {
    await createDatabase()
    await PostgresConnection.connect()
    await queriesPostgresUser().createTable()
  })

  afterAll(async () => {
    await queriesPostgresUser().dropDatabase()
    await PostgresConnection.end()
  })

  it('Should delete user with success', async () => {
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