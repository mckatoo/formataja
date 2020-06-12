import { Router } from 'express'
import authRoutes from './auth'
import usersRoutes from './users'

const routes = Router()

routes.use('/login', authRoutes),
routes.use('/users', usersRoutes)

export default routes
