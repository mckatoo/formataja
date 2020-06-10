import faker from 'faker'
import request from 'supertest'
import { PrismaClient } from '@prisma/client'
import app from '../../src/app'

const users = new PrismaClient().users

describe('Users', function() {
  beforeAll(async() => {
    await users.deleteMany({
      where: {
        id_user: {
          gt: 0
        }
      }
    })
  })

  it('Should return user list', async() => {
    const response = await request(app)
    .get('/users')
    expect(response.status).toBe(200)
  });

  it('should list users by id', async () => {
    const user = await users.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        password: faker.internet.password()
      }
    })
    const response = await request(app)
    .get(`/users/id/${user.id_user}`)
    // .set('Authorization', `Bearer ${user.generateToken()}`)
    expect(response.status).toBe(200)
    expect(response.body.user.name).toBe(user.name)
    expect(response.body.user.email).toBe(user.email)
    expect(response.body.user.password).toBe(user.password)
  })

  it('should list users by email', async () => {
    const user = await users.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        password: faker.internet.password()
      }
    })
    const response = await request(app)
    .get(`/users/email/${user.email}`)
    // .set('Authorization', `Bearer ${user.generateToken()}`)
    expect(response.status).toBe(200)
    expect(response.body.user[0].email).toBe(user.email)
  })

  it('Should return user created', async() => {
    const user = {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: faker.internet.email(),
      password: faker.internet.password()
    }
    const response = await request(app)
    .post('/users')
    .send(user)
    expect(response.status).toBe(201)
    expect(response.body.user.email).toBe(user.email)
  });

  it('Should return user updated', async() => {
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
    expect(response.status).toBe(202)
    expect(response.body.user.name).toBe(newUser.name)
    expect(response.body.user.email).toBe(newUser.email)
    expect(response.body.user.password).toBe(newUser.password)
  });

  it('Should fail return user deleted', async() => {
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
    expect(response.status).toBe(204)
  });

})

