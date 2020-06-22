/**
 * @file             : ArticleController.ts
 * @author           : Milton Carlos Katoo <mckatoo@gmail.com>
 * Date              : 22.06.2020
 * Last Modified Date: 22.06.2020
 * Last Modified By  : Milton Carlos Katoo <mckatoo@gmail.com>
 */
import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()
const { articles } = prisma

export class ArticleController {
  async store (req: Request, res: Response) {
    try {
      const article = await articles.create({
        include: {
          users: true,
          formats: true
        },
        data: {
          ...req.body,
          formats: {
            connect: { id_format: parseInt(req.body.formats.id_format) }
          },
          users: {
            connect: { id_user: parseInt(req.body.users.id_user) }
          }
        }
      })
      return res.status(201).json({
        article
      })
    } catch (errors) {
      return res.status(400).json(errors)
    } finally {
      await prisma.disconnect()
    }
  }

  async list (req: Request, res: Response) {
    try {
      const { text } = req.params
      const articles_list = await articles.findMany({
        where: {
          OR: [
            {
              title: {
                contains: text
              }
            },
            {
              topics: {
                some: {
                  title: {
                    contains: text
                  }
                }
              }
            },
            {
              topics: {
                some: {
                  text: {
                    contains: text
                  }
                }
              }
            }
          ]
        },
        include: {
          users: true,
          formats: true,
          topics: true
        }
      })
      return res.status(200).json({ articles: articles_list })
    } catch (error) {
      return res.status(400).json({ error })
    } finally {
      await prisma.disconnect()
    }
  }

  async delete (req: Request, res: Response) {
    try {
      const { id_article } = req.body
      await articles.delete({
        where: { id_article }
      })
      return res.status(204).send()
    } catch (errors) {
      return res.status(404).json(errors)
    } finally {
      await prisma.disconnect()
    }
  }

  async update (req: Request, res: Response) {
    try {
      const { id_article } = req.body
      const article = await articles.update({
        where: { id_article },
        include: {
          formats: true,
          users: true
        },
        data: {
          ...req.body,
          formats: {
            connect: { id_format: parseInt(req.body.formats.id_format) }
          },
          users: {
            connect: { id_user: parseInt(req.body.users.id_user) }
          }
        }
      })
      return res.status(202).json({
        article
      })
    } catch (errors) {
      return res.status(400).json(errors)
    } finally {
      await prisma.disconnect()
    }
  }

  async listById (req: Request, res: Response) {
    try {
      const id_article = parseInt(req.params.id_article)
      const article = await articles.findOne({
        where: { id_article }
      })
      return res.status(200).json({ article })
    } catch (error) {
      return res.status(400).json({ error })
    } finally {
      await prisma.disconnect()
    }
  }
}
