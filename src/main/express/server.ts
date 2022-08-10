/* eslint-disable no-console */
import app from './app'
import PostgresConnection, { createDb } from '@/infra/database/connection'
import queriesPostgresUser from '@/infra/helpers/queries-postgres-user'
import queriesPostgresGroup from '@/infra/helpers/queries-postgres-group'

import cors from 'cors'

const PORT = process.env.PORT || 3001

createDb().then(() => {
  PostgresConnection.connect()
    .then(async () => {
      await queriesPostgresGroup().createTable()
      await queriesPostgresUser().createTable()
      app.use(cors())
      app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))
    })
    .catch((err) => console.log(err))
})