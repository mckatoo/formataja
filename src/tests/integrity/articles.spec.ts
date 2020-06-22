/**
 * @file             : articles.spec.ts
 * @author           : Milton Carlos Katoo <mckatoo@gmail.com>
 * Date              : 22.06.2020
 * Last Modified Date: 22.06.2020
 * Last Modified By  : Milton Carlos Katoo <mckatoo@gmail.com>
 */
import { PrismaClient } from '@prisma/client'
import faker from 'faker'
import request from 'supertest'

import app from '../../app'
import TokenService from '../../services/TokenService'

const { generateToken } = new TokenService()
const prisma = new PrismaClient()
const { users, articles } = prisma

interface User {
  id_user?: number
  name: string
  email: string
  password: string
}

let user: User = {
  id_user: 0,
  name: '',
  email: '',
  password: '',
}

const articles_list: any = []

describe('Articles', function () {
  beforeAll(async () => {
    user = await users.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    })
    for (let index = 0; index < 3; index++) {
      articles_list[index] = await articles.create({
        data: {
          title: faker.lorem.words(5),
          formats: {
            create: {
              name: `${faker.name.firstName()} ${faker.name.lastName()}`,
              fonts: {
                create: {
                  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                },
              },
            },
          },
          users: {
            create: {
              name: `${faker.name.firstName()} ${faker.name.lastName()}`,
              email: faker.internet.email(),
              password: faker.internet.password(),
            },
          },
          topics: {
            create: {
              title: faker.lorem.words(5),
              text: faker.lorem.text(345),
            },
          },
        },
        include: {
          users: true,
          topics: true,
          formats: true,
        },
      })
    }
  })

  afterAll(async () => {
    // await articles.deleteMany({
    //   where: {
    //     id_article: {
    //       gt: 0
    //     }
    //   }
    // })
    await prisma.disconnect()
  })

  it('Should return articles list', async () => {
    const response = await request(app)
      .get('/articles')
      .set('authorization', `Bearer ${generateToken({ id: user.id_user })}`)
    expect(response.status).toBe(200)
  })

  it('Should return articles filtered by title', async () => {
    const response = await request(app)
      .get(`/articles/${articles_list[1].title.substring(4, 16)}`)
      .set('authorization', `Bearer ${generateToken({ id: user.id_user })}`)
    expect(response.status).toBe(200)
    expect(response.body.articles.length).toBe(1)
    expect(response.body.articles[0].title).toBe(articles_list[1].title)
  })

  it('Should return articles filtered by title of topics', async () => {
    const response = await request(app)
      .get(`/articles/${articles_list[1].topics[0].title.substring(4, 16)}`)
      .set('authorization', `Bearer ${generateToken({ id: user.id_user })}`)
    expect(response.status).toBe(200)
    expect(response.body.articles.length).toBeGreaterThanOrEqual(1)
  })

  it('Should return articles filtered by text of topics', async () => {
    const response = await request(app)
      .get(`/articles/${articles_list[1].topics[0].text.substring(20, 56)}`)
      .set('authorization', `Bearer ${generateToken({ id: user.id_user })}`)
    expect(response.status).toBe(200)
    expect(response.body.articles.length).toBeGreaterThanOrEqual(1)
  })

  it('Should list articles by id', async () => {
    const response = await request(app)
      .get(`/articles/id/${articles_list[1].id_article}`)
      .set('authorization', `Bearer ${generateToken({ id: user.id_user })}`)
    expect(response.status).toBe(200)
    expect(response.body.article.title).toBe(articles_list[1].title)
  })

  it('Should create and return article', async () => {
    const article = {
      title: faker.lorem.words(5),
      formats: {
        id_format: articles_list[0].formats.id_format,
      },
      users: {
        id_user: articles_list[0].users.id_user,
      },
    }
    const response = await request(app)
      .post('/articles')
      .send(article)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${generateToken({ id: user.id_user })}`)
    expect(response.status).toBe(201)
    expect(response.body.article.title).toBe(article.title)
    expect(response.body.article.formats.id_format).toBe(
      article.formats.id_format
    )
    expect(response.body.article.users.id_user).toBe(article.users.id_user)
  })

  it('Should return article updated with new title', async () => {
    const oldArticle = await articles.create({
      include: {
        users: true,
        formats: true
      },
      data: {
        title: faker.lorem.words(5),
        users: {
          connect: { id_user: parseInt(articles_list[0].users.id_user) },
        },
        formats: {
          connect: { id_format: parseInt(articles_list[0].formats.id_format) },
        },
      },
    })
    const newArticle = {
      id_article: oldArticle.id_article,
      title: faker.lorem.words(6),
      formats: {
        id_format: oldArticle.formats.id_format
      },
      users: {
        id_user: oldArticle.users.id_user
      }
    }
    const response = await request(app)
      .patch('/articles')
      .send(newArticle)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${generateToken({ id: user.id_user })}`)
    expect(response.status).toBe(202)
    expect(response.body.article.title).toBe(newArticle.title)
    expect(response.body.article.id_article).toBe(newArticle.id_article)
    expect(response.body.article.id_article).toBe(oldArticle.id_article)
  })

  it('Should fail return article deleted', async () => {
    const article = await articles.create({
      include: {
        users: true,
        formats: true
      },
      data: {
        title: faker.lorem.words(5),
        users: {
          connect: { id_user: parseInt(articles_list[0].users.id_user) },
        },
        formats: {
          connect: { id_format: parseInt(articles_list[0].formats.id_format) },
        },
      },
    })
    const response = await request(app)
      .delete('/articles')
      .send({
        id_article: article.id_article,
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${generateToken({ id: user.id_user })}`)
    expect(response.status).toBe(204)
  })
})
