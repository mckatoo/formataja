/**
 * @file             : index.ts
 * @author           : Milton Carlos Katoo <mckatoo@gmail.com>
 * Date              : 21.06.2020
 * Last Modified Date: 21.06.2020
 * Last Modified By  : Milton Carlos Katoo <mckatoo@gmail.com>
 */
import { Router } from 'express'
import { AuthController } from '@controllers/AuthController'

const controller = new AuthController()
const routes = Router()

// routes.post('/', (req, res) => {
// res.status(200).send()
// })
routes.post('/', controller.login)
// routes.get('/id/:id_user', UserController.listById)
// routes.get('/email/:email', UserController.listByEmail)
// routes.post('/', UserController.store)
// routes.patch('/', UserController.update)
// routes.delete('/', UserController.delete)

export default routes
