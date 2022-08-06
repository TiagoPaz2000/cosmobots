import { EditUserRepository, FindUserByIdRepository, ListUsersRepository } from '@/data/protocols'
import AddUserRepository from '@/data/protocols/add-user-repository'
import UserEntity from '@/domain/entities/user-entity'
import dbConnection from '../database/connection'
import serializeUser from '../helpers/serialize-user-data'

class UserRepository implements
  AddUserRepository,
  ListUsersRepository,
  FindUserByIdRepository,
  EditUserRepository {
  async create(userData: UserEntity): Promise<UserEntity> {
    const user = serializeUser.serializeInsert(userData)
    const query = 'INSERT INTO users(user_id, group_id, account_id, first_name, last_name, email) VALUES($1, $2, $3, $4, $5, $6) RETURNING *'
    const { rows } = await dbConnection.query(query, user)
    return serializeUser.serializeResponse(rows[0])
  }

  async list(): Promise<UserEntity[]> {
    const query = 'SELECT * FROM users'
    const { rows } = await dbConnection.query(query)
    const users = rows.map((user) => serializeUser.serializeResponse(user))
    return users
  }

  async find(userId: string): Promise<UserEntity> {
    const query = 'SELECT * FROM users WHERE user_id = $1'
    const { rows } = await dbConnection.query(query, [userId])
    const user = serializeUser.serializeResponse(rows[0])
    return user
  }

  async edit(userData: UserEntity): Promise<UserEntity> {
    const user = serializeUser.serializeInsert(userData)
    const query = `UPDATE users
      SET group_id = $2, account_id = $3, first_name = $4, last_name = $5, email = $6
      WHERE user_id = $1 RETURNING *`
    const { rows } = await dbConnection.query(query, user)
    return serializeUser.serializeResponse(rows[0])
  }
}

export default UserRepository
