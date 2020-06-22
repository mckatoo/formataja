/**
 * @file             : index.ts
 * @author           : Milton Carlos Katoo <mckatoo@gmail.com>
 * Date              : 21.06.2020
 * Last Modified Date: 22.06.2020
 * Last Modified By  : Milton Carlos Katoo <mckatoo@gmail.com>
 */
import { Router } from 'express'

import auth from '../middlewares/auth'
import articlesRoutes from './articles'
import authRoutes from './auth'
import fontsRoutes from './fonts'
import formatsRoutes from './formats'
import topicsRoutes from './topics'
import usersRoutes from './users'

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
routes.use('/articles', articlesRoutes)

export default routes
