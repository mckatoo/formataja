import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import TokenService from '../services/TokenService'

const Fonts = new PrismaClient().fonts
const { generateToken } = new TokenService()

export default {

  async store (req: Request, res: Response) {
    try {
      const font = await Fonts.create({
        data: {
          name: req.body.name
        },
        select: {
          id_font: true,
          name: true
        }
      })
      return res.status(201).json({
        font
      })
    } catch (errors) {
      return res.status(400).json(errors)
    }
  },

  async list(_req: Request, res: Response) {
    try {
      const fonts = await Fonts.findMany({
        select: {
          id_font: true,
          name: true,
        }
      })
      return res.status(200).json({ fonts })
    } catch (error) {
      return res.status(400).json({ error })
    }
  },

  async delete (req: Request, res: Response) {
    try {
      const { id_font } = req.body
      await Fonts.delete({
        where: { id_font },
        select: {
          id_font: true,
          name: true
        }
      })
      return res.status(204).send()
    } catch (errors) {
      return res.status(404).json(errors)
    }
  },

  async update (req: Request, res: Response) {
    try {
      const { id_font, name } = req.body
      const font = await Fonts.update({
        where: { id_font },
        data: { name },
        select: {
          id_font: true,
          name: true,
        }
      })
      return res.status(202).json({
        font,
        token: generateToken({ id: font.id_font })
      })
    } catch (errors) {
      return res.status(400).json(errors)
    }
  },

  async listById (req: Request, res: Response) {
    try {
      const id_font = parseInt(req.params.id_font)
      const font = await Fonts.findOne({
        where: { id_font  },
        select: {
          id_font: true,
          name: true,
        }
      })
      return res.status(200).json({ font })
    } catch (error) {
      return res.status(400).json({ error })
    }
  },

  async listByName (req: Request, res: Response) {
    try {
      const { name } = req.params
      const font = await Fonts.findMany({
        where: { name },
        select: {
          id_font: true,
          name: true,
        }
      })
      return res.status(200).json({ font })
    } catch (error) {
      return res.status(400).json(error)
    }
  }
}

