import AddUserRepository from '@/data/protocols/user-repository'
import UserEntity from '@/domain/entities/user-entity'
import dbConnection from '../database/connection'
import serializeUser from '../helpers/serialize-user-data'

class UserRepository implements AddUserRepository {
  async create(userData: UserEntity): Promise<UserEntity> {
    const user = serializeUser.serializeInsert(userData)
    const query = 'INSERT INTO users(user_id, account_id, group_id, first_name, last_name, email) VALUES($1, $2, $3, $4, $5, $6) RETURNING *'
    const { rows } = await dbConnection.query(query, user)
    return serializeUser.serializeResponse(rows[0])
  }
}

export default UserRepository