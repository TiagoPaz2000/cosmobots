/* eslint-disable @typescript-eslint/no-explicit-any */
import User from '@/domain/entities/user-entity'

const serializeUser = {
  serializeInsert: (userData: User) => ([
    userData.userId,
    userData.groupId,
    userData.accountId,
    userData.firstName,
    userData.lastName,
    userData.email,
  ]),
  serializeResponse: (userData: any) => ({
    userId: userData.user_id,
    accountId: userData.account_id,
    groupId: userData.group_id,
    firstName: userData.first_name,
    lastName: userData.last_name,
    email: userData.email,
  }),
}

export default serializeUser