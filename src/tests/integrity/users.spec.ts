/**
 * @file             : users.spec.ts
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
const { users } = prisma

describe('Users', function () {
  beforeAll(async () => {
  })

  afterAll(async () => {
    await prisma.disconnect()
  })

  it('Should return No token provided!', async () => {
    await users.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        password: faker.internet.password()
      }
    })
    const response = await request(app)
      .get('/users')
    expect(response.status).toBe(401)
    expect(response.header).not.toHaveProperty('authorization')
    expect(response.body.error).toBe('No token provided!')
  })

  it('Should return Token error!', async () => {
    await users.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        password: faker.internet.password()
      }
    })
    const response = await request(app)
      .get('/users')
      .set('authorization', 'Bearer ')
    expect(response.status).toBe(401)
    expect(response.header).not.toHaveProperty('authorization')
    expect(response.body.error).toBe('Token error!')
  })

  it('Should return Token malformatted!', async () => {
    const user = await users.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        password: faker.internet.password()
      }
    })
    const response = await request(app)
      .get('/users')
      .set('authorization', `fsdf ${generateToken({ id: user.id_user })}`)
    expect(response.status).toBe(401)
    expect(response.header).not.toHaveProperty('authorization')
    expect(response.body.error).toBe('Token malformatted!')
  })

  it('Should return Token invalid!', async () => {
    await users.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        password: faker.internet.password()
      }
    })
    const response = await request(app)
      .get('/users')
      .set('authorization', `Bearer 4${generateToken({ id: 45454 })}`)
    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Token invalid!')
  })

  it('Should return user list', async () => {
    const user = await users.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        password: faker.internet.password()
      }
    })
    const response = await request(app)
      .get('/users')
      .set('authorization', `Bearer ${generateToken({ id: user.id_user })}`)
    expect(response.status).toBe(200)
  })

  it('Should list users by id', async () => {
    const user = await users.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        password: faker.internet.password()
      }
    })
    const response = await request(app)
      .get(`/users/id/${user.id_user}`)
      .set('Authorization', `Bearer ${generateToken({ id: user.id_user })}`)
    expect(response.status).toBe(200)
    expect(response.body.user.name).toBe(user.name)
    expect(response.body.user.email).toBe(user.email)
    expect(response.body.user).not.toHaveProperty('password')
  })

  it('Should list users by name without password field', async () => {
    const users_list = await users.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        password: faker.internet.password()
      }
    })
    const response = await request(app)
      .get(`/users/name/${users_list.name}`)
      .set('Authorization', `Bearer ${generateToken({ id: users_list.id_user })}`)
    expect(response.status).toBe(200)
    expect(response.body.users[0].email).toBe(users_list.email)
    expect(response.body.users[0]).not.toHaveProperty('password')
  })

  it('Should list users by email without password field', async () => {
    const users_list = await users.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        password: faker.internet.password()
      }
    })
    const response = await request(app)
      .get(`/users/email/${users_list.email}`)
      .set('Authorization', `Bearer ${generateToken({ id: users_list.id_user })}`)
    expect(response.status).toBe(200)
    expect(response.body.users[0].email).toBe(users_list.email)
    expect(response.body.users[0]).not.toHaveProperty('password')
  })

  it('Not should create user with existent name', async () => {
    const existentUser = await users.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        password: faker.internet.password()
      }
    })
    const user = {
      name: existentUser.name,
      email: faker.internet.email(),
      password: faker.internet.password()
    }
    const response = await request(app)
      .post('/users')
      .send(user)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${generateToken({ id: existentUser.id_user })}`)
    expect(response.status).toBe(400)
  })

  it('Not should create user with existent email', async () => {
    const existentUser = await users.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        password: faker.internet.password()
      }
    })
    const user = {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: existentUser.email,
      password: faker.internet.password()
    }
    const response = await request(app)
      .post('/users')
      .send(user)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${generateToken({ id: existentUser.id_user })}`)
    expect(response.status).toBe(400)
  })

  it('Should create and return user with token', async () => {
    const existentUser = await users.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        password: faker.internet.password()
      }
    })
    const user = {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: faker.internet.email(),
      password: faker.internet.password()
    }
    const response = await request(app)
      .post('/users')
      .send(user)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${generateToken({ id: existentUser.id_user })}`)
    expect(response.status).toBe(201)
    expect(response.body.user.email).toBe(user.email)
    expect(response.body.user).not.toHaveProperty('password')
    expect(response.body).toHaveProperty('token')
  })

  it('Should return user updated with new token', async () => {
    const oldUser = await users.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        password: faker.internet.password()
      }
    })
    const newUser = {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: faker.internet.email(),
      password: faker.internet.password()
    }
    const response = await request(app)
      .patch('/users')
      .send({
        id_user: oldUser.id_user,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${generateToken({ id: oldUser.id_user })}`)
    expect(response.status).toBe(202)
    expect(response.body.user.name).toBe(newUser.name)
    expect(response.body.user.email).toBe(newUser.email)
    expect(response.body).toHaveProperty('token')
    expect(response.body.user).not.toHaveProperty('password')
  })

  it('Should fail return user deleted', async () => {
    const user = await users.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        password: faker.internet.password()
      }
    })
    const response = await request(app)
      .delete('/users')
      .send({
        id_user: user.id_user
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${generateToken({ id: user.id_user })}`)
    expect(response.status).toBe(204)
  })
})
