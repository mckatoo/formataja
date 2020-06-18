import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const { formats } = prisma;
import { Request, Response } from 'express';
import TokenService from '../services/TokenService';
const { generateToken } = new TokenService();

export default {
  async store(req: Request, res: Response) {
    try {
      const format = await formats.create({
        data: {
          ...req.body,
          fonts: {
            connect: { id_font: req.body.fonts.id_font },
          },
        },
        select: {
          id_format: true,
          name: true,
          fonts: true,
        },
      });
      return res.status(201).json({
        format,
      });
    } catch (errors) {
      return res.status(400).json(errors);
    } finally {
      await prisma.disconnect();
    }
  },

  async list(_req: Request, res: Response) {
    try {
      const formats_list = await formats.findMany({
        select: {
          id_format: true,
          name: true,
        },
      });
      return res.status(200).json({ formats: formats_list });
    } catch (error) {
      return res.status(400).json({ error });
    } finally {
      await prisma.disconnect();
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id_format } = req.body;
      await formats.delete({
        where: { id_format },
        select: {
          id_format: true,
          name: true,
          fonts: true,
        },
      });
      return res.status(204).send();
    } catch (errors) {
      return res.status(404).json(errors);
    } finally {
      await prisma.disconnect();
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id_format } = req.body;
      const format = await formats.update({
        where: { id_format },
        data: {
          ...req.body,
          fonts: {
            connect: {
              id_font: req.body.fonts.id_font
            }
          }
        },
        select: {
          id_format: true,
          name: true,
          fonts: true,
        },
      });
      return res.status(202).json({
        format,
        token: generateToken({ id: format.id_format }),
      });
    } catch (errors) {
      return res.status(400).json(errors);
    } finally {
      await prisma.disconnect();
    }
  },

  async listById(req: Request, res: Response) {
    try {
      const id_format = parseInt(req.params.id_format);
      const format = await formats.findOne({
        where: { id_format },
        select: {
          id_format: true,
          name: true,
          fonts: true,
        },
      });
      return res.status(200).json({ format });
    } catch (error) {
      return res.status(400).json({ error });
    } finally {
      await prisma.disconnect();
    }
  },

  async listByName(req: Request, res: Response) {
    try {
      const { name } = req.params;
      const formats_list = await formats.findMany({
        where: { name },
        select: {
          id_format: true,
          name: true,
          fonts: true,
        },
      });
      return res.status(200).json({ formats: formats_list });
    } catch (error) {
      return res.status(400).json(error);
    } finally {
      await prisma.disconnect();
    }
  },
};
