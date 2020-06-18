import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import TokenService from '../services/TokenService'

const prisma = new PrismaClient()
const { users }= prisma
const { generateToken } = new TokenService()

export default {

  async store (req: Request, res: Response) {
    try {
      const hash = await bcrypt.hash(req.body.password, 10)
      req.body.password = hash
      const user = await users.create({
        data: req.body,
        select: {
          id_user: true,
          name: true,
          email: true
        }
      })
      return res.status(201).json({
        user,
        token: generateToken({ id: user.id_user })
      })
    } catch (errors) {
      return res.status(400).json(errors)
    } finally {
      await prisma.disconnect()
    }
  },

  async list(_req: Request, res: Response) {
    try {
      const users_list = await users.findMany({
        select: {
          id_user: true,
          name: true,
          email: true
        }
      })
      return res.status(200).json({ users: users_list })
    } catch (error) {
      return res.status(400).json({ error })
    } finally {
      await prisma.disconnect()
    }
  },

  async delete (req: Request, res: Response) {
    try {
      const { id_user } = req.body
      await users.delete({
        where: { id_user },
        select: {
          id_user: true,
          name: true,
          email: true
        }
      })
      return res.status(204).send()
    } catch (errors) {
      return res.status(404).json(errors)
    } finally {
      await prisma.disconnect()
    }
  },

  async update (req: Request, res: Response) {
    try {
      const { id_user, name, email, password } = req.body
      const hash = await bcrypt.hash(password, 10)
      const user = await users.update({
        where: { id_user },
        data: { name, email, password: hash },
        select: {
          id_user: true,
          name: true,
          email: true
        }
      })
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

  async listById (req: Request, res: Response) {
    try {
      const id_user = parseInt(req.params.id_user)
      const user = await users.findOne({
        where: { id_user  },
        select: {
          id_user: true,
          name: true,
          email: true
        }
      })
      return res.status(200).json({ user })
    } catch (error) {
      return res.status(400).json({ error })
    } finally {
      await prisma.disconnect()
    }
  },

  async listByName (req: Request, res: Response) {
    try {
      const { name } = req.params
      const users_list = await users.findMany({
        where: { name },
        select: {
          id_user: true,
          name: true,
          email: true
        }
      })
      return res.status(200).json({ users: users_list })
    } catch (error) {
      return res.status(400).json(error)
    } finally {
      await prisma.disconnect()
    }
  },

  async listByEmail (req: Request, res: Response) {
    try {
      const { email } = req.params
      const users_list = await users.findMany({
        where: { email },
        select: { id_user: true, name: true, email: true }
      })
      return res.status(200).json({ users: users_list })
    } catch (error) {
      return res.status(400).json(error)
    } finally {
      await prisma.disconnect()
    }
  }

}

