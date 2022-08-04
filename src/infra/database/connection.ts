import { Client } from 'pg'
import 'dotenv/config'

const { DB_USER, DB_HOST, DB_NAME, DB_PASSWORD } = process.env

const connection = new Client({
  user: DB_USER || 'root',
  host: DB_HOST || 'localhost',
  database: DB_NAME || 'cosmo_database',
  password: DB_PASSWORD || 'password',
  port: 5432,
})

export default connection