import { Router } from 'express'
import FontController from '../../controllers/FontController'

const usersRoutes = Router()

usersRoutes.get('/', FontController.list)
usersRoutes.get('/id/:id_font', FontController.listById)
usersRoutes.get('/name/:name', FontController.listByName)
usersRoutes.post('/', FontController.store)
usersRoutes.patch('/', FontController.update)
usersRoutes.delete('/', FontController.delete)

export default usersRoutes
