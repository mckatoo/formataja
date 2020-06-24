/**
 * @file             : topics.spec.ts
 * @author           : Milton Carlos Katoo <mckatoo@gmail.com>
 * Date              : 22.06.2020
 * Last Modified Date: 24.06.2020
 * Last Modified By  : Milton Carlos Katoo <mckatoo@gmail.com>
 */
import { PrismaClient } from '@prisma/client'
import faker from 'faker'
import request from 'supertest'

import app from '../../app'
import TokenService from '../../services/TokenService'

const { generateToken } = new TokenService()
const prisma = new PrismaClient()
const { users, topics, articles } = prisma
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

const topics_list: any = []

describe('Topics', function () {
  beforeAll(async () => {
    user = await users.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    })
    for (let index = 0; index < 3; index++) {
      topics_list[index] = await topics.create({
        data: {
          title: faker.lorem.words(5),
          text: faker.lorem.text(350),
          articles: {
            create: {
              title: faker.lorem.words(5),
              users: {
                create: {
                  email: faker.internet.email(),
                  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                  password: faker.internet.password(),
                },
              },
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
            },
          },
        },
        include: {
          articles: true,
        },
      })
    }
  })

  afterAll(async () => {
    await prisma.disconnect()
  })

  it('Should return topics list', async () => {
    const response = await request(app)
      .get('/topics')
      .set('authorization', `Bearer ${generateToken({ id: user.id_user })}`)
    expect(response.status).toBe(200)
  })

  it('Should return topics filtered by title', async () => {
    const response = await request(app)
      .get(`/topics/${topics_list[1].title}`)
      .set('authorization', `Bearer ${generateToken({ id: user.id_user })}`)
    expect(response.status).toBe(200)
    expect(response.body.topics.length).toBe(1)
  })

  it('Should return topics filtered by text', async () => {
    const response = await request(app)
      .get(`/topics/${topics_list[1].text}`)
      .set('authorization', `Bearer ${generateToken({ id: user.id_user })}`)
    expect(response.status).toBe(200)
    expect(response.body.topics.length).toBe(1)
  })

  it('Should list topics by id', async () => {
    const response = await request(app)
      .get(`/topics/id/${topics_list[1].id_topic}`)
      .set('authorization', `Bearer ${generateToken({ id: user.id_user })}`)
    expect(response.status).toBe(200)
    expect(response.body.topic.name).toBe(topics_list[1].name)
  })

  it('Should create and return topic', async () => {
    const topic = {
      title: faker.lorem.words(5),
      text: faker.lorem.text(260),
      articles: {
        id_article: topics_list[0].id_article,
      },
    }
    const response = await request(app)
      .post('/topics')
      .send(topic)
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${generateToken({ id: user.id_user })}`)
    expect(response.status).toBe(201)
    expect(response.body.topic.title).toBe(topic.title)
    expect(response.body.topic.text).toBe(topic.text)
    expect(response.body.topic.id_article).toBe(topic.articles.id_article)
  })

  it('Should return topic updated with new title and article', async () => {
    const newArticle = await articles.create({
      data: {
        title: faker.lorem.words(5),
        users: {
          connect: { id_user: user.id_user },
        },
        formats: {
          connect: { id_format: topics_list[0].articles.id_format },
        },
      },
    })
    const oldTopic = await topics.create({
      data: {
        title: faker.lorem.words(5),
        text: faker.lorem.text(345),
        articles: {
          connect: { id_article: topics_list[0].id_article },
        },
      },
    })
    const newTopic = {
      title: faker.lorem.words(5),
      text: faker.lorem.text(260),
      articles: {
        id_article: newArticle.id_article,
      },
    }
    const response = await request(app)
      .patch('/topics')
      .send({
        id_topic: oldTopic.id_topic,
        title: newTopic.title,
        articles: { id_article: newArticle.id_article },
      })
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${generateToken({ id: user.id_user })}`)
    expect(response.status).toBe(202)
    expect(response.body.topic.title).toBe(newTopic.title)
    expect(response.body.topic.id_article).toBe(newArticle.id_article)
  })

  it('Should fail return topic deleted', async () => {
    const topic = await topics.create({
      data: {
        title: faker.lorem.words(5),
        text: faker.lorem.text(345),
        articles: {
          connect: { id_article: topics_list[0].id_article },
        },
      },
    })
    const response = await request(app)
      .delete('/topics')
      .send({
        id_topic: topic.id_topic,
      })
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${generateToken({ id: user.id_user })}`)
    expect(response.status).toBe(204)
  })
})
