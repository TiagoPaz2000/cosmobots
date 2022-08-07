import express from 'express'

import userRouter from './routes/user-routes'
import groupRouter from './routes/group-routes'

const app = express()

app.use(express.json())
app.use('/api/users', userRouter)
app.use('/api/groups', groupRouter)

export default app