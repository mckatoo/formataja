/**
 * @file             : index.ts
 * @author           : Milton Carlos Katoo <mckatoo@gmail.com>
 * Date              : 22.06.2020
 * Last Modified Date: 22.06.2020
 * Last Modified By  : Milton Carlos Katoo <mckatoo@gmail.com>
 */
import { ArticleController } from '@controllers/ArticleController'
import { Router } from 'express'

const controller = new ArticleController()
const routes = Router()

routes.get('/:text?', controller.list)
routes.get('/id/:id_article', controller.listById)
routes.post('/', controller.store)
routes.patch('/', controller.update)
routes.delete('/', controller.delete)

export default routes
