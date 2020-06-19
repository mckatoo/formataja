import { Router } from 'express'
import TopicController from '../../controllers/TopicController'

const routes = Router()

routes.get('/:text?', TopicController.list)
routes.get('/id/:id_topic', TopicController.listById)
routes.post('/', TopicController.store)
routes.patch('/', TopicController.update)
routes.delete('/', TopicController.delete)

export default routes
