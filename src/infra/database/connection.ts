import { Client } from 'pg'
import { createDatabase } from 'pg-god'
import 'dotenv/config'

const { DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT } = process.env

const connection = new Client({
  user: DB_USER || 'root',
  host: DB_HOST || 'localhost',
  database: DB_NAME || 'cosmo_database_test',
  password: DB_PASSWORD || 'password',
  port: Number(DB_PORT) || 5432,
})

export const createDb = async () => {
  await createDatabase({ databaseName: DB_NAME || 'cosmo_database_test' }, {
    user: DB_USER || '',
    port: Number(DB_PORT) || 5432,
    host: DB_HOST || 'localhost',
    password: DB_PASSWORD || 'password',
  })
}

export default connection