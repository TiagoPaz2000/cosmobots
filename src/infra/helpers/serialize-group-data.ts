/* eslint-disable @typescript-eslint/no-explicit-any */
import Group from '@/domain/entities/group-entity'

const serializeGroup = {
  serializeResponse: (userData: any): Group => ({
    groupId: userData.group_id,
    groupName: userData.groupName,
    groupDescription: userData.groupDescription,
  }),
}

export default serializeGroup