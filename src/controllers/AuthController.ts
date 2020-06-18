import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import TokenService from '../services/TokenService'

const prisma = new PrismaClient();
const { users } = prisma
const { generateToken } = new TokenService()

export default {

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body.user;
      const user = await users.findOne({
        where: {
          email
        }
      })

      if (!user) {
        return res.status(401).json({ error: 'User not found!' })
      }

      if (!await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ error: 'Password incorrect!' })
      }

      return res.status(202).json({
        user,
        token: generateToken({ id: user.id_user })
      })
    } catch (errors) {
      return res.status(400).json(errors)
    } finally {
      await prisma.disconnect()
    }
  },

}

