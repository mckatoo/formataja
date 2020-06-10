import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const Users = new PrismaClient().users

export default {

  async store (req: Request, res: Response) {
    try {
      Users.create({
        data: req.body
      }).then((user) => {
        return res.status(201).json({user})
      })
    } catch (errors) {
      return res.status(400).json(errors)
    }
  },

  async list(_req: Request, res: Response) {
    try {
      const users = await Users.findMany()
      return res.status(200).json({ users })
    } catch (error) {
      return res.status(400).json({ error })
    }
  },

  async delete (req: Request, res: Response) {
    try {
      const { id_user } = req.body
      const user = await Users.delete({
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
      })
      return res.status(202).json({ user })
    } catch (errors) {
      return res.status(400).json(errors)
    }
  },

  async listById (req: Request, res: Response) {
    try {
      const id_user = parseInt(req.params.id_user)
      const user = await Users.findOne({
        where: { id_user  }
      })
      return res.status(200).json({ user })
    } catch (error) {
      return res.status(400).json({ error })
    }
  },

  async listByEmail (req: Request, res: Response) {
    try {
      const { email } = req.params
      const user = await Users.findMany({
        where: { email }
      })
      return res.status(200).json({ user })
    } catch (error) {
      return res.status(400).json(error)
    }
  }

  // async listByType (req: Request, res: Response) {
  // try {
  // const { type } = req.params
  // const { page = 1, paginate = 0 } = req.query
  // const options = {
  // include: {
  // model: UserType,
  // where: { type: { [Op.substring]: type } }
  // },
  // attributes: { exclude: ['password_hash', 'token'] },
  // page,
  // paginate: parseInt(paginate),
  // order: [['id', 'DESC']]
  // }
  // if (paginate === 0) {
  // const { rows: users, count: total } = await User.findAndCountAll(
  // options
  // )
  // return res.status(200).json({ users, total })
  // }
  // const { docs: users, pages, total } = await User.paginate(options)
  // return res.status(200).json({ users, pages, total })
  // } catch (error) {
  // return res.status(400).json({ error })
  // }
  // }
}

