import { Router } from 'express'
import UserController from '../../controllers/UserController'

const routes = Router()

routes.get('/', UserController.list)
routes.get('/id/:id_user', UserController.listById)
routes.get('/name/:name', UserController.listByName)
routes.get('/email/:email', UserController.listByEmail)
routes.post('/', UserController.store)
routes.patch('/', UserController.update)
routes.delete('/', UserController.delete)

export default routes
