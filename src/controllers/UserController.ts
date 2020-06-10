import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import faker from 'faker'

const prisma = new PrismaClient()

export default {
  async list(_req: Request, res: Response) {
    try {
      const user = await prisma.users.create({
        data: {
          name: `${faker.name.firstName()} ${faker.name.lastName()}`,
          email: faker.internet.email(),
          password: faker.internet.password()
        }
      })
      return res.status(200).json({ user })
    } catch (error) {
      return res.status(400).json({ error })
    }
  }

  // async listById (req, res) {
  // try {
  // const id = req.params.userId
  // const user = await User.findByPk(id, {
  // include: [UserType],
  // attributes: { exclude: ['password_hash', 'token'] }
  // })
  // return res.status(200).json(user)
  // } catch (error) {
  // return res.status(400).json({ error })
  // }
  // }

  // async listByEmail (req, res) {
  // try {
  // const { email } = req.params
  // const user = await User.findOne({
  // include: [UserType],
  // attributes: { exclude: ['password_hash', 'token'] },
  // where: { email: { [Op.substring]: email } }
  // })
  // return res.status(200).json(user)
  // } catch (error) {
  // return res.status(400).json(error)
  // }
  // }

  // async listByType (req, res) {
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

  // async store (_req: Request, res: Response) {
  // try {
  // prisma.users.create({
  // data: {
  // name: 'Milton',
  // email: 'mckatoo@gmail.com',
  // password: '12312'
  // }
  // }).then((user) => {
  // return res.status(201).json({user})
  // })
  // } catch (errors) {
  // return res.status(400).json(errors)
  // }
  // }

  // async destroy (req, res) {
  // try {
  // const { id } = req.body
  // await User.destroy({ where: { id } })
  // return res.status(204).json({})
  // } catch (errors) {
  // return res.status(404).json(errors)
  // }
  // }

  // async update (req, res) {
  // try {
  // const { id } = req.body
  // const user = await User.findByPk(id)
  // user.update(req.body)
  // return res.status(202).json({ user })
  // } catch (errors) {
  // return res.status(400).json(errors)
  // }
  // }
}

