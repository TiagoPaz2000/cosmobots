import express from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerDocs from '../../../docs/swagger.json'

import userRouter from './routes/user-routes'
import groupRouter from './routes/group-routes'

const app = express()

app.use(express.json())
app.use('/api/users', userRouter)
app.use('/api/groups', groupRouter)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

export default app