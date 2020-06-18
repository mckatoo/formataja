import { Router } from 'express'
import FormatsController from '../../controllers/FormatsController'

const routes = Router()

routes.get('/', FormatsController.list)
routes.get('/id/:id_format', FormatsController.listById)
routes.get('/name/:name', FormatsController.listByName)
routes.post('/', FormatsController.store)
routes.patch('/', FormatsController.update)
routes.delete('/', FormatsController.delete)

export default routes
