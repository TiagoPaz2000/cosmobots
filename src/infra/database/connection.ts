import { Client } from 'pg'
import 'dotenv/config'

const { DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT } = process.env

const connection = new Client({
  user: DB_USER || 'root',
  host: DB_HOST || 'localhost',
  database: DB_NAME || 'cosmo_database',
  password: DB_PASSWORD || 'password',
  port: Number(DB_PORT) || 5432,
})

export default connection