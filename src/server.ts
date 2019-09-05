import app from './app'
import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 3333

app.listen(PORT, (): void => {
  console.log(`E-co server is running on port: ${PORT}`)
})
