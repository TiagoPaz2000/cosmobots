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

const user = {
  userId: uuid(),
  accountId: uuid(),
  firstName: 'valid_firstName',
  lastName: 'valid_lastName',
  email: 'valid_email@mail.com',
  groupId: 'f00af341-655c-4763-a46e-01e42cc69d1f',
} 

const newUser = {
  accountId: uuid(),
  firstName: 'new_valid_firstName',
  lastName: 'new_valid_lastName',
  email: 'new_valid_email@mail.com',
  groupId: '9c3af0d1-4203-428e-9951-e1873f14bb21',
} 

describe('Edit User', () => {
  beforeAll(async () => {
    await createDatabase()
    await PostgresConnection.connect()
    await queriesPostgresUser().createTable()
  })

  afterAll(async () => {
    await queriesPostgresUser().dropTable()
    await PostgresConnection.end()
  })

  it('Should edit user with success', async () => {
    const userRepository = new UserRepository()
    const createdUser = await userRepository.create(user)
    const response = await request(app)
      .put(`/api/users/${createdUser.userId}`)
      .send(newUser)
    const userEdited = await userRepository.find(createdUser.userId)
  
    expect(response.body.response.body).toEqual(userEdited)
  })
})