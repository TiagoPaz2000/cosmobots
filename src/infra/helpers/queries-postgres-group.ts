import PostgresConnection from '@/infra/database/connection'

const queriesPostgresGroup = () => {
  const createTable = async () => {
    await PostgresConnection.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    await PostgresConnection.query(`CREATE TABLE IF NOT EXISTS groups (
      group_id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
      group_name VARCHAR (20) NOT NULL,
      group_description VARCHAR (255)
    );`,
    )
  }

  const createDatabase = async () => {
    PostgresConnection.query('CREATE DATABASE cosmo_database')
      .catch((error) => error)
  }

  const dropTable = async () => {
    await PostgresConnection.query('DROP TABLE IF EXISTS "groups" CASCADE')
  }

  return { createTable, createDatabase, dropTable }
}

export default queriesPostgresGroup