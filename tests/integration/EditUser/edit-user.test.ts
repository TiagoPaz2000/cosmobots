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

  it('Should return a bad request if group doesn\'t exist', async () => {
    const groupRepository = new GroupRepository()
    const requestsGroups = await groupRepository.create(group)
    user.groupId = requestsGroups.groupId
    user.userId = uuid()
    const userRepository = new UserRepository()
    const createdUser = await userRepository.create(user)
    newUser.groupId = uuid()
    const response = await request(app)
      .put(`/api/users/${createdUser.userId}`)
      .send(newUser)
      .set('Accept', 'application/json')
    expect(response.status).toBe(400)
    expect(response.body).toEqual({ response: { message: '\"groupId\" doesn\'t exists' } })
  })

  it('Should return a bad request if groupId, accountId and userId not be uuid', async () => {
    const groupRepository = new GroupRepository()
    const requestsGroups = await groupRepository.create(group)
    user.userId = uuid()
    user.groupId = requestsGroups.groupId
    newUser.accountId = 'invalid_uuid'
    newUser.groupId = 'invalid_uuid'
    
    const userRepository = new UserRepository()
    await userRepository.create(user)

    const response = await request(app)
      .put(`/api/users/invalid_uuid`)
      .send(newUser)
      .set('Accept', 'application/json')
    
    expect(response.status).toBe(400)
    expect(response.body)
      .toEqual({ response: { message: ['userId must be a uuid', 'groupId must be a uuid', 'accountId must be a uuid'] } })
  })
})