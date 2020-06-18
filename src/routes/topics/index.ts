import { Router } from 'express'
import TopicController from '../../controllers/TopicController'

const routes = Router()

routes.get('/', TopicController.list)
routes.get('/id/:id_font', TopicController.listById)
routes.get('/name/:name', TopicController.listByName)
routes.post('/', TopicController.store)
routes.patch('/', TopicController.update)
routes.delete('/', TopicController.delete)

export default routes
