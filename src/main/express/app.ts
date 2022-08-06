import express from 'express'
import AddUserFactory from '@/presentation/factories/add-user-factory'
import ListUsersFactory from '@/presentation/factories/list-users-factory'

const app = express()

app.use(express.json())

app.post('/users', async (req, res) => {
  const response = await AddUserFactory().handle(req)

  return res.status(response.statusCode).json({ response: response.body })
})

app.get('/users', async (_req, res) => {
  const response = await ListUsersFactory().handle()

  return res.status(response.statusCode).json({ response: response.body })
})

export default app