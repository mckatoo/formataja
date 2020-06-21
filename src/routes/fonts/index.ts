import { Router } from 'express'
import { FontController } from '@controllers/FontController'

const controller = new FontController()
const routes = Router()

routes.get('/', controller.list)
routes.get('/id/:id_font', controller.listById)
routes.get('/name/:name', controller.listByName)
routes.post('/', controller.store)
routes.patch('/', controller.update)
routes.delete('/', controller.delete)

export default routes
