import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import TokenService from '../services/TokenService';

const prisma = new PrismaClient();
const { topics } = prisma;
const { generateToken } = new TokenService();

export default {
  async store(req: Request, res: Response) {
    try {
      const topic = await topics.create({
        data: {
          ...req.body,
          articles: {
            connect: { id_article: parseInt(req.body.articles.id_article) },
          },
        },
      });
      return res.status(201).json({
        topic,
      });
    } catch (errors) {
      return res.status(400).json(errors);
    } finally {
      await prisma.disconnect();
    }
  },

  async list(req: Request, res: Response) {
    try {
      const { text } = req.params;
      const topics_list = await topics.findMany({
        where: {
          OR: [
            {
              title: {
                contains: text,
              },
            },
            {
              text: {
                contains: text,
              },
            },
          ],
        },
      });
      return res.status(200).json({ topics: topics_list });
    } catch (error) {
      return res.status(400).json({ error });
    } finally {
      await prisma.disconnect();
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id_topic } = req.body;
      await topics.delete({
        where: { id_topic },
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
      const { id_topic } = req.body;
      const topic = await topics.update({
        where: { id_topic },
        data: {
          ...req.body,
          articles: {
            connect: { id_article: parseInt(req.body.articles.id_article) },
          },
        },
      });
      return res.status(202).json({
        topic,
        token: generateToken({ id: topic.id_topic }),
      });
    } catch (errors) {
      return res.status(400).json(errors);
    } finally {
      await prisma.disconnect();
    }
  },

  async listById(req: Request, res: Response) {
    try {
      const id_topic = parseInt(req.params.id_topic);
      const topic = await topics.findOne({
        where: { id_topic },
      });
      return res.status(200).json({ topic });
    } catch (error) {
      return res.status(400).json({ error });
    } finally {
      await prisma.disconnect();
    }
  },
};
