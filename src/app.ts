import express from 'express'

const app = express()

export default app.use(express.json())

app.get('/', (_req, res) => {
  return res.json('olá mundo')
})
