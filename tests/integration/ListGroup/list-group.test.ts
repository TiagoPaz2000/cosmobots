/**
 * @jest-environment ./tests/integration/config/jest-environment/pg-environment.ts
*/

import request from 'supertest'
import { v4 as uuid } from 'uuid'

import app from '@/main/express/app'
import PostgresConnection from '@/infra/database/connection'
import queriesPostgresUser from '@/infra/helpers/queries-postgres-user'
import GroupRepository from '@/infra/repositories/group-repository'
import queriesPostgresGroup from '@/infra/helpers/queries-postgres-group'
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

describe('List Group', () => {
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

  it('Should list empty array with success', async () => {
    const response = await request(app)
      .get('/api/groups/94fc004e-ddff-41b5-9a95-973223e8fd02')
    
    expect(response.body).toEqual({ response: {} })
  })

  it('Should list group with success', async () => {
    const groupRepository = new GroupRepository()
    const requests = groups.map((group) => groupRepository.create(group))
    const responses = await Promise.all(requests)

    const response = await request(app)
      .get(`/api/groups/${responses[1].groupId}`)
    
    expect(response.body)
      .toEqual({ response: { body: { groupId: responses[1].groupId, ...groups[1] } } })
  })
})