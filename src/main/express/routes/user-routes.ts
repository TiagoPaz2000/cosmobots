import { Router } from 'express'

import AddUserFactory from '@/presentation/factories/add-user-factory'
import ListUsersFactory from '@/presentation/factories/list-users-factory'
import EditUserFactory from '@/presentation/factories/edit-user-factory'

const router = Router()

router.post('/', async (req, res) => {
  const response = await AddUserFactory().handle(req)

  return res.status(response.statusCode).json({ response: response.body })
})

router.get('/', async (_req, res) => {
  const response = await ListUsersFactory().handle()

  return res.status(response.statusCode).json({ response: response.body })
})

router.put('/:userId', async (req, res) => {
  const body = { ...req.body, ...req.params }
  const response = await EditUserFactory().handle({ body })
  return res.status(response.statusCode).json({ response: response.body })
})

export default router