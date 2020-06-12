import bcrypt from 'bcryptjs'
import faker from 'faker'
import request from 'supertest'
import { PrismaClient } from '@prisma/client'
import app from '../../src/app'

const Users = new PrismaClient().users

describe('Authentication', function() {
  beforeAll(async() => {
    await Users.deleteMany({
      where: {
        id_user: {
          gt: 0
        }
      }
    })
  })

  it('Should return login accepted', async() => {
    const password = faker.internet.password()
    const hash = await bcrypt.hash(password, 10)
    const user = await Users.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        password: hash
      }
    })
    user.password = password
    const response = await request(app)
    .post('/login')
    .send({ user })
    expect(response.status).toBe(202)
  });

  it('Should deny access with email not found', async() => {
    const hash = await bcrypt.hash(faker.internet.password(), 10)
    const user = await Users.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        password: hash
      }
    })
    user.email = 'aaaaaaa@ssssss.com'
    const response = await request(app)
    .post('/login')
    .send({ user })
    expect(response.status).toBe(401)
    expect(response.body.error).toBe('User not found!')

  });

  it('Should deny access with password incorrect.', async() => {
    const hash = await bcrypt.hash(faker.internet.password(), 10)
    const user = await Users.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        password: hash
      }
    })
    user.password = 'afsdfjsd'
    const response = await request(app)
    .post('/login')
    .send({ user })
    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Password incorrect!')
  });

})

