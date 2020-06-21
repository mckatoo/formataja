import { Router } from 'express'
import { FormatsController } from '@controllers/FormatsController'

const controller = new FormatsController()
const routes = Router()

routes.get('/', controller.list)
routes.get('/id/:id_format', controller.listById)
routes.get('/name/:name', controller.listByName)
routes.post('/', controller.store)
routes.patch('/', controller.update)
routes.delete('/', controller.delete)

export default routes
