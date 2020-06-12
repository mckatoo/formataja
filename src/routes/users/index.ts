import { Router } from 'express'
import UserController from '../../controllers/UserController'

const usersRoutes = Router()

usersRoutes.get('/', UserController.list)
usersRoutes.get('/id/:id_user', UserController.listById)
usersRoutes.get('/name/:name', UserController.listByName)
usersRoutes.get('/email/:email', UserController.listByEmail)
usersRoutes.post('/', UserController.store)
usersRoutes.patch('/', UserController.update)
usersRoutes.delete('/', UserController.delete)

export default usersRoutes
