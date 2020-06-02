import express from 'express'

const app = express()

app.get('/', (_req, res) => {
  res.json(true)
})

app.listen(3000)
