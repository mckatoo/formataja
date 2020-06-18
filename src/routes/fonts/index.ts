import { Router } from 'express'
import FontController from '../../controllers/FontController'

const routes = Router()

routes.get('/', FontController.list)
routes.get('/id/:id_font', FontController.listById)
routes.get('/name/:name', FontController.listByName)
routes.post('/', FontController.store)
routes.patch('/', FontController.update)
routes.delete('/', FontController.delete)

export default routes
