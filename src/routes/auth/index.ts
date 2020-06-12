import { Router } from 'express'
import AuthController from '../../controllers/AuthController'

const authRoutes = Router()

// authRoutes.post('/', (req, res) => {
  // res.status(200).send()
// })
authRoutes.post('/', AuthController.login)
// authRoutes.get('/id/:id_user', UserController.listById)
// authRoutes.get('/email/:email', UserController.listByEmail)
// authRoutes.post('/', UserController.store)
// authRoutes.patch('/', UserController.update)
// authRoutes.delete('/', UserController.delete)

export default authRoutes
