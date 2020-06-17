import { Router } from 'express'
import auth from '../middlewares/auth'
import authRoutes from './auth'
import usersRoutes from './users'
import fontsRoutes from './fonts'

const routes = Router()

routes.use('/login', authRoutes),
routes.use(auth),
routes.get('/', (req, res) => {
  res.send({ ok: true, user_id: req.user_id })
})
routes.use('/users', usersRoutes)
routes.use('/fonts', fontsRoutes)

export default routes
