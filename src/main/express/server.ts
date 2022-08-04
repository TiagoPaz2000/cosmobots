import app from './app'
import PostgresConnection from '@/infra/database/connection'

const PORT = process.env.PORT || 3000

PostgresConnection.connect()
  .then(() => {
    console.log('test')
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))
  })
  .catch((err) => console.log(err))