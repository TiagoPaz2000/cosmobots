import PostgresConnection from '@/infra/database/connection'
import 'dotenv/config'

const queriesPostgresUser = () => {
  const createTable = async () => {
    await PostgresConnection.query(`CREATE TABLE IF NOT EXISTS users (
        user_id UUID PRIMARY KEY,
        email VARCHAR (255) NOT NULL,
        first_name VARCHAR (50) NOT NULL,
        last_name VARCHAR (50) NOT NULL,
        account_id UUID NOT NULL,
        group_id UUID NOT NULL REFERENCES groups (group_id) ON DELETE CASCADE ON UPDATE CASCADE
      )`,
    )
  }

  const dropTable = async () => {
    await PostgresConnection.query('DROP TABLE IF EXISTS "users" CASCADE')
  }

  return { createTable, dropTable }
}

export default queriesPostgresUser