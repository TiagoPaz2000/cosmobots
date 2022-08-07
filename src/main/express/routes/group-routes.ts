import { Router } from 'express'

import listGroupFactory from '@/presentation/factories/list-group-factory'

const router = Router()

router.get('/:groupId', async (req, res) => {
  const response = await listGroupFactory().handle({ body: { groupId: req.params.groupId } })
  return res.status(response.statusCode).json({ response: response.body })
})

export default router