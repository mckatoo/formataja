import jwt from 'jsonwebtoken'
import authConfig from '../config/auth.json'

class TokenService {
  generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
      expiresIn: 86400
    })
  }
}

export default TokenService
