/**
 * @file             : app.ts
 * @author           : Milton Carlos Katoo <mckatoo@gmail.com>
 * Date              : 24.06.2020
 * Last Modified Date: 24.06.2020
 * Last Modified By  : Milton Carlos Katoo <mckatoo@gmail.com>
 */
import express from 'express'

import routes from './routes'

const app = express()

app.use(express.json())
app.use(routes)

export default app
