/**
 * @file             : formats.spec.ts
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
const { users, formats, fonts } = prisma
interface User {
  id_user?: number;
  name: string;
  email: string;
  password: string;
}
let user: User

describe('Formats', function () {
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
    // await formats.deleteMany({
    //   where: {
    //     id_format: {
    //       gt: 0
    //     }
    //   }
    // })
    await prisma.disconnect()
  })

  it('Should return formats list', async () => {
    await formats.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        fonts: {
          create: {
            name: `${faker.name.firstName()} ${faker.name.lastName()}`
          }
        }
      }
    })
    const response = await request(app)
      .get('/formats')
      .set('authorization', `Bearer ${generateToken({ id: user.id_user })}`)
    expect(response.status).toBe(200)
  })

  it('Should list formats by id', async () => {
    const format = await formats.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        fonts: {
          create: {
            name: `${faker.name.firstName()} ${faker.name.lastName()}`
          }
        }
      },
      select: {
        id_format: true,
        name: true,
        fonts: true
      }
    })
    const response = await request(app)
      .get(`/formats/id/${format.id_format}`)
      .set('authorization', `Bearer ${generateToken({ id: user.id_user })}`)
    expect(response.status).toBe(200)
    expect(response.body.format.name).toBe(format.name)
    expect(response.body.format.fonts.name).toBe(format.fonts.name)
  })

  it('Should list formats by name', async () => {
    const format = await formats.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        fonts: {
          create: {
            name: `${faker.name.firstName()} ${faker.name.lastName()}`
          }
        }
      },
      select: {
        id_format: true,
        name: true,
        fonts: true
      }
    })
    const response = await request(app)
      .get(`/formats/name/${format.name}`)
      .set('authorization', `Bearer ${generateToken({ id: user.id_user })}`)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('formats')
  })

  it('Should create and return format', async () => {
    const font = await fonts.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`
      }
    })
    const format = {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      fonts: font
    }
    const response = await request(app)
      .post('/formats')
      .send(format)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${generateToken({ id: user.id_user })}`)
    expect(response.status).toBe(201)
    expect(response.body.format.name).toBe(format.name)
    expect(response.body.format.fonts.id_font).toBe(format.fonts.id_font)
  })

  it('Should return format updated.', async () => {
    const newFont = await fonts.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`
      }
    })
    const oldFormat = await formats.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        fonts: {
          create: {
            name: `${faker.name.firstName()} ${faker.name.lastName()}`
          }
        }
      }
    })
    const newFormat = {
      id_format: oldFormat.id_format,
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      fonts: newFont
    }
    const response = await request(app)
      .patch('/formats')
      .send(newFormat)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${generateToken({ id: user.id_user })}`)
    expect(response.status).toBe(202)
    expect(response.body.format.id_format).toBe(oldFormat.id_format)
    expect(response.body.format.name).toBe(newFormat.name)
    expect(response.body.format.fonts.id_font).toBe(newFont.id_font)
    expect(response.body.format.fonts.name).toBe(newFont.name)
  })

  it('Should delete format.', async () => {
    const format = await formats.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        fonts: {
          create: {
            name: `${faker.name.firstName()} ${faker.name.lastName()}`
          }
        }
      }
    })
    const response = await request(app)
      .delete('/formats')
      .send({
        id_format: format.id_format
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${generateToken({ id: user.id_user })}`)
    expect(response.status).toBe(204)
  })
})
