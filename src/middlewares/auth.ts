import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import authConfig from '../config/auth.json'

const auth = (req: Request, res: Response, next:NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader)
    return res.status(401).send({ error: 'No token provided!' })

  const parts = authHeader.split(' ')

  if(parts.length !== 2) {
    return res.status(401).send({ error: 'Token error!' })
  }

  const [ scheme, token ] = parts

  if(!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ error: 'Token malformatted!' })
  }

  jwt.verify(token, authConfig.secret, (error, decoded) => {
    if (error) {
      return res.status(401).json({ error: 'Token invalid!' })
    }

    // req.userId = decoded.id
    return next()
  })

}

export default auth
