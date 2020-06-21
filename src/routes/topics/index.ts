import { Router } from 'express'
import { TopicController } from '@controllers/TopicController'

const controller = new TopicController()
const routes = Router()

routes.get('/:text?', controller.list)
routes.get('/id/:id_topic', controller.listById)
routes.post('/', controller.store)
routes.patch('/', controller.update)
routes.delete('/', controller.delete)

export default routes
