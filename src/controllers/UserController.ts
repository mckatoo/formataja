import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import TokenService from '../services/TokenService'

const Users = new PrismaClient().users
const { generateToken } = new TokenService()

export default {

  async store (req: Request, res: Response) {
    try {
      const hash = await bcrypt.hash(req.body.password, 10)
      const user = await Users.create({
        data: {
          name: req.body.name,
          email: req.body.email,
          password: hash
        },
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
    }
  },

  async list(_req: Request, res: Response) {
    try {
      const users = await Users.findMany({
        select: {
          id_user: true,
          name: true,
          email: true
        }
      })
      return res.status(200).json({ users })
    } catch (error) {
      return res.status(400).json({ error })
    }
  },

  async delete (req: Request, res: Response) {
    try {
      const { id_user } = req.body
      await Users.delete({
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
    }
  },

  async update (req: Request, res: Response) {
    try {
      const { id_user, name, email, password } = req.body
      const user = await Users.update({
        where: { id_user },
        data: { name, email, password },
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
    }
  },

  async listById (req: Request, res: Response) {
    try {
      const id_user = parseInt(req.params.id_user)
      const user = await Users.findOne({
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
    }
  },

  async listByName (req: Request, res: Response) {
    try {
      const { name } = req.params
      const user = await Users.findMany({
        where: { name },
        select: {
          id_user: true,
          name: true,
          email: true
        }
      })
      return res.status(200).json({ user })
    } catch (error) {
      return res.status(400).json(error)
    }
  },

  async listByEmail (req: Request, res: Response) {
    try {
      const { email } = req.params
      const user = await Users.findMany({
        where: { email },
        select: { id_user: true, name: true, email: true }
      })
      return res.status(200).json({ user })
    } catch (error) {
      return res.status(400).json(error)
    }
  }

}

