import { Router } from 'express'
import AuthController from '../../controllers/AuthController'

const routes = Router()

// routes.post('/', (req, res) => {
  // res.status(200).send()
// })
routes.post('/', AuthController.login)
// routes.get('/id/:id_user', UserController.listById)
// routes.get('/email/:email', UserController.listByEmail)
// routes.post('/', UserController.store)
// routes.patch('/', UserController.update)
// routes.delete('/', UserController.delete)

export default routes
