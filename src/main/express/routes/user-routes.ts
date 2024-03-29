import { Router } from 'express'

import AddUserFactory from '@/presentation/factories/add-user-factory'
import ListUsersFactory from '@/presentation/factories/list-users-factory'
import EditUserFactory from '@/presentation/factories/edit-user-factory'
import DeleteUserFactory from '@/presentation/factories/delete-user-factory'
import FindUsersByGroupFactory from '@/presentation/factories/find-users-by-group-factory'

const router = Router()

router.post('/', async (req, res) => {
  const response = await AddUserFactory().handle(req)

  return res.status(response.statusCode).json({ response: response.body })
})

router.get('/', async (req, res) => {
  const response = await ListUsersFactory().handle({ body: req.query })

  return res.status(response.statusCode).json({ response: response.body })
})

router.get('/:groupId', async (req, res) => {
  const response = await FindUsersByGroupFactory().handle({ body: req.params })

  return res.status(response.statusCode).json({ response: response.body })
})

router.put('/:userId', async (req, res) => {
  const body = { ...req.body, ...req.params }
  const response = await EditUserFactory().handle({ body })
  return res.status(response.statusCode).json({ response: response.body })
})

router.delete('/:userId', async (req, res) => {
  const response = await DeleteUserFactory().handle({ body: req.params })
  if (response.body.statusCode !== 204) {
    return res.status(response.statusCode).json({ response: response.body })
  }
  return res.status(response.statusCode).end()
})

export default router