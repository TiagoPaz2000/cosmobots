/**
 * @jest-environment ./tests/integration/config/jest-environment/pg-environment.ts
*/

import request from 'supertest'
import { v4 as uuid } from 'uuid'

import app from '@/main/express/app'
import PostgresConnection from '@/infra/database/connection'
import queriesPostgresUser from '@/infra/helpers/queries-postgres-user'

jest.setTimeout(15000);

const httpRequest = {
  body: {
    accountId: uuid(),
    firstName: 'valid_firstName',
    lastName: 'valid_lastName',
    email: 'valid_email@mail.com',
    groupId: 'f00af341-655c-4763-a46e-01e42cc69d1f',
  }
}

const createDatabase = async () => {
  PostgresConnection.query('CREATE DATABASE cosmo_database_test')
    .catch((error) => error)
}

describe('Add User', () => {
  beforeAll(async () => {
    await createDatabase()
    await PostgresConnection.connect()
    await queriesPostgresUser().createTable()
  })

  afterAll(async () => {
    await queriesPostgresUser().dropDatabase()
    await PostgresConnection.end()
  })

  it('Should create a new user with success', async () => {
    const response = await request(app)
      .post('/users')
      .send(httpRequest.body)
      .set('Accept', 'application/json')

    const { rows } = await PostgresConnection.query(`SELECT * FROM users WHERE user_id = $1`, [response.body.response.userId])

    expect(rows[0].user_id).toBe(response.body.response.userId)
  })
})