/* eslint-disable no-console */
import app from './app'
import PostgresConnection from '@/infra/database/connection'
import queriesPostgresUser from '@/infra/helpers/queries-postgres-user'

const PORT = process.env.PORT || 3000

PostgresConnection.connect()
  .then(async () => {
    await queriesPostgresUser().createDatabase()
    await queriesPostgresUser().createTable()
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))
  })
  .catch((err) => console.log(err))