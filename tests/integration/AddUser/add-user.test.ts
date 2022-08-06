/**
 * @jest-environment ./tests/integration/config/jest-environment/pg-environment.ts
*/

import request from 'supertest'
import { v4 as uuid } from 'uuid'

import app from '@/main/express/app'
// import UserRepository from '@/infra/repositories/add-user-repository'
// import db, { sql } from '../config/database/db-connection';
// import AddUserRepository from '@/data/protocols/user-repository';
// import userEntity from '@/domain/entities/user-entity';
import PostgresConnection from '@/infra/database/connection'

jest.setTimeout(15000);

const createDatabase = async () => {
  PostgresConnection.query(`CREATE DATABASE cosmo_database_test`)
    .catch((error) => error)
}

const httpRequest = {
  body: {
    accountId: uuid(),
    firstName: 'valid_firstName',
    lastName: 'valid_lastName',
    email: 'valid_email@mail.com',
    groupId: 'f00af341-655c-4763-a46e-01e42cc69d1f',
  }
}

describe('Add User', () => {
  beforeAll(async () => {
    await createDatabase()
    await PostgresConnection.connect()
    await PostgresConnection.query(`CREATE TABLE IF NOT EXISTS users (
      user_id UUID PRIMARY KEY,
      email VARCHAR (255) NOT NULL,
      first_name VARCHAR (50) NOT NULL,
      last_name VARCHAR (50) NOT NULL,
      account_id UUID NOT NULL,
      group_id UUID NOT NULL
    )`)
  })

  afterAll(async () => {
    await PostgresConnection.query(`DROP TABLE IF EXISTS "users" CASCADE`)
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