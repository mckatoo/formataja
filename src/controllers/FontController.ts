import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import TokenService from '../services/TokenService'

const prisma = new PrismaClient()
const { fonts } = prisma
const { generateToken } = new TokenService()

export default {

  async store (req: Request, res: Response) {
    try {
      const font = await fonts.create({
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
    } finally {
      await prisma.disconnect()
    }
  },

  async list(_req: Request, res: Response) {
    try {
      const fonts_list = await fonts.findMany({
        select: {
          id_font: true,
          name: true,
        }
      })
      return res.status(200).json({ fonts_list })
    } catch (error) {
      return res.status(400).json({ error })
    } finally {
      await prisma.disconnect()
    }
  },

  async delete (req: Request, res: Response) {
    try {
      const { id_font } = req.body
      await fonts.delete({
        where: { id_font },
        select: {
          id_font: true,
          name: true
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
      const { id_font, name } = req.body
      const font = await fonts.update({
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
    } finally {
      await prisma.disconnect()
    }
  },

  async listById (req: Request, res: Response) {
    try {
      const id_font = parseInt(req.params.id_font)
      const font = await fonts.findOne({
        where: { id_font  },
        select: {
          id_font: true,
          name: true,
        }
      })
      return res.status(200).json({ font })
    } catch (error) {
      return res.status(400).json({ error })
    } finally {
      await prisma.disconnect()
    }
  },

  async listByName (req: Request, res: Response) {
    try {
      const { name } = req.params
      const fonts_list = await fonts.findMany({
        where: { name },
        select: {
          id_font: true,
          name: true,
        }
      })
      return res.status(200).json({ fonts_list })
    } catch (error) {
      return res.status(400).json(error)
    } finally {
      await prisma.disconnect()
    }

  }
}

