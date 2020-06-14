import { Router } from 'express'
import auth from '../middlewares/auth'
import authRoutes from './auth'
import usersRoutes from './users'

const routes = Router()

routes.use('/login', authRoutes),
routes.use(auth),
routes.use('/users', usersRoutes)

export default routes
