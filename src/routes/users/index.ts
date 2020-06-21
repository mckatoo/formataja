import { Router } from 'express'
import { UserController } from '@controllers/UserController'

const controller = new UserController()
const routes = Router()

routes.get('/', controller.list)
routes.get('/id/:id_user', controller.listById)
routes.get('/name/:name', controller.listByName)
routes.get('/email/:email', controller.listByEmail)
routes.post('/', controller.store)
routes.patch('/', controller.update)
routes.delete('/', controller.delete)

export default routes
