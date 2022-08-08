/**
 * @jest-environment ./tests/integration/config/jest-environment/pg-environment.ts
*/

import request from 'supertest'
import { v4 as uuid } from 'uuid'

import app from '@/main/express/app'
import PostgresConnection from '@/infra/database/connection'
import queriesPostgresUser from '@/infra/helpers/queries-postgres-user'
import queriesPostgresGroup from '@/infra/helpers/queries-postgres-group'
import GroupRepository from '@/infra/repositories/group-repository'

jest.setTimeout(15000)

const httpRequest = {
  body: {
    accountId: uuid(),
    firstName: 'valid_firstName',
    lastName: 'valid_lastName',
    email: 'valid_email@mail.com',
    groupId: '',
  }
}

const httpRequest2 = {
  body: {
    accountId: uuid(),
    firstName: 'valid_firstName',
    lastName: 'valid_lastName',
    email: 'valid_email@mail.com',
    groupId: uuid(),
  }
}

const group = {
  groupName: 'grupo1',
  groupDescription: undefined
}

const createDatabase = async () => {
  PostgresConnection.query('CREATE DATABASE cosmo_database_test')
    .catch((error) => error)
}

describe('Add User', () => {
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

  it('Should create a new user with success', async () => {
    const groupRepository = new GroupRepository()
    const requestsGroups = await groupRepository.create(group)
    httpRequest.body.groupId = requestsGroups.groupId

    const response = await request(app)
      .post('/api/users')
      .send(httpRequest.body)
      .set('Accept', 'application/json')
    
    const { rows } = await PostgresConnection
      .query(`SELECT * FROM users WHERE user_id = $1`, [response.body.response.body.userId])

    expect(rows[0].user_id).toBe(response.body.response.body.userId)
  })

  it('Should return a bad request if group doesn\'t exist', async () => {
    const response = await request(app)
      .post('/api/users')
      .send(httpRequest2.body)
      .set('Accept', 'application/json')
    
    expect(response.status).toBe(400)
    expect(response.body).toEqual({ response: { message: '\"groupId\" doesn\'t exists' } })
  })

  it('Should return a bad request if groupId and accountId not be uuid', async () => {
    httpRequest2.body.accountId = 'invalid_uuid'
    httpRequest2.body.groupId = 'invalid_uuid'
    const response = await request(app)
      .post('/api/users')
      .send(httpRequest2.body)
      .set('Accept', 'application/json')
    
    expect(response.status).toBe(400)
    expect(response.body)
      .toEqual({ response: { message: ['groupId must be a uuid', 'accountId must be a uuid'] } })
  })
})