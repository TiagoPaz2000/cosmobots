/* eslint-disable @typescript-eslint/no-explicit-any */
import Group from '@/domain/entities/group-entity'

const serializeGroup = {
  serializeInsert: (groupData: Omit<Group, 'groupId'>) => ([
    groupData.groupName,
    groupData.groupDescription,
  ]),
  serializeResponse: (userData: any): Group => ({
    groupId: userData.group_id,
    groupName: userData.group_name,
    groupDescription: userData.group_description,
  }),
}

export default serializeGroup