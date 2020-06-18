import { Router } from 'express'
import FormatsController from '../../controllers/FormatsController'

const usersRoutes = Router()

usersRoutes.get('/', FormatsController.list)
usersRoutes.get('/id/:id_format', FormatsController.listById)
usersRoutes.get('/name/:name', FormatsController.listByName)
usersRoutes.post('/', FormatsController.store)
usersRoutes.patch('/', FormatsController.update)
usersRoutes.delete('/', FormatsController.delete)

export default usersRoutes
