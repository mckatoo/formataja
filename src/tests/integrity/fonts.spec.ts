/**
 * @file             : fonts.spec.ts
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
const { users, fonts } = prisma
interface User {
  id_user?: number;
  name: string;
  email: string;
  password: string;
}

let user: User = {
  id_user: 0,
  name: '',
  email: '',
  password: ''
}

describe('Fonts', function () {
  beforeAll(async () => {
    user = await users.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        password: faker.internet.password()
      }
    })
  })

  afterAll(async () => {
    // await fonts.deleteMany({
    //   where: {
    //     id_font: {
    //       gt: 0
    //     }
    //   }
    // })
    await prisma.disconnect()
  })

  it('Should return fonts list', async () => {
    await fonts.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`
      }
    })
    const response = await request(app)
      .get('/fonts')
      .set('authorization', `Bearer ${generateToken({ id: user.id_user })}`)
    expect(response.status).toBe(200)
  })

  it('Should list fonts by id', async () => {
    const font = await fonts.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`
      }
    })
    const response = await request(app)
      .get(`/fonts/id/${font.id_font}`)
      .set('authorization', `Bearer ${generateToken({ id: user.id_user })}`)
    expect(response.status).toBe(200)
    expect(response.body.font.name).toBe(font.name)
  })

  it('Should list fonts by name', async () => {
    const font = await fonts.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`
      }
    })
    const response = await request(app)
      .get(`/fonts/name/${font.name}`)
      .set('Authorization', `Bearer ${generateToken({ id: user.id_user })}`)
    expect(response.status).toBe(200)
  })

  it('Not should create font with existent name', async () => {
    const existentFont = await fonts.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`
      }
    })
    const font = {
      name: existentFont.name
    }
    const response = await request(app)
      .post('/fonts')
      .send(font)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${generateToken({ id: user.id_user })}`)
    expect(response.status).toBe(400)
  })

  it('Should create and return font', async () => {
    const font = {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`
    }
    const response = await request(app)
      .post('/fonts')
      .send(font)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${generateToken({ id: user.id_user })}`)
    expect(response.status).toBe(201)
    expect(response.body.font.name).toBe(font.name)
  })

  it('Should return font updated with new token', async () => {
    const oldFont = await fonts.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`
      }
    })
    const newFont = {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`
    }
    const response = await request(app)
      .patch('/fonts')
      .send({
        id_font: oldFont.id_font,
        name: newFont.name
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${generateToken({ id: oldFont.id_font })}`)
    expect(response.status).toBe(202)
    expect(response.body.font.name).toBe(newFont.name)
  })

  it('Should fail return font deleted', async () => {
    const font = await fonts.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`
      }
    })
    const response = await request(app)
      .delete('/fonts')
      .send({
        id_font: font.id_font
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${generateToken({ id: user.id_user })}`)
    expect(response.status).toBe(204)
  })
})
