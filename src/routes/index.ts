/**
 * @file             : index.ts
 * @author           : Milton Carlos Katoo <mckatoo@gmail.com>
 * Date              : 21.06.2020
 * Last Modified Date: 21.06.2020
 * Last Modified By  : Milton Carlos Katoo <mckatoo@gmail.com>
 */
import { Router } from 'express'
import auth from '../middlewares/auth'
import authRoutes from './auth'
import usersRoutes from './users'
import fontsRoutes from './fonts'
import topicsRoutes from './topics'
import formatsRoutes from './formats'

const routes = Router()

routes.use('/login', authRoutes)
routes.use(auth)
routes.get('/', (req, res) => {
  res.send({ ok: true, user_id: req.user_id })
})
routes.use('/users', usersRoutes)
routes.use('/fonts', fontsRoutes)
routes.use('/formats', formatsRoutes)
routes.use('/topics', topicsRoutes)

export default routes
