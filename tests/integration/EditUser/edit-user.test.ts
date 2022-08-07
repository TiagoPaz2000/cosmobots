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
  groupId: '',
} 

const newUser = {
  accountId: uuid(),
  firstName: 'new_valid_firstName',
  lastName: 'new_valid_lastName',
  email: 'new_valid_email@mail.com',
  groupId: '',
}

const group = {
  groupName: 'grupo1',
  groupDescription: undefined
}

describe('Edit User', () => {
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

  it('Should edit user with success', async () => {
    const groupRepository = new GroupRepository()
    const requestsGroups = await groupRepository.create(group)
    user.groupId = requestsGroups.groupId
    newUser.groupId = requestsGroups.groupId
    const userRepository = new UserRepository()
    const createdUser = await userRepository.create(user)
    const response = await request(app)
      .put(`/api/users/${createdUser.userId}`)
      .send(newUser)
    const userEdited = await userRepository.find(createdUser.userId)
    expect(response.body.response.body).toEqual(userEdited)
  })
})