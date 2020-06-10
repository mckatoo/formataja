import request from 'supertest'
import faker from 'faker'
import { PrismaClient } from '@prisma/client'
import app from '../../src/app'

const prisma = new PrismaClient()

describe('Users', function() {
  beforeAll(async() => {
  })

  afterAll(async() => {
  })

  beforeEach(async() => {
    prisma.users.deleteMany({})
  })

  it('Return user list', async() => {
    const response = await request(app)
      .get('/users')
    expect(response.status).toBe(200)
    // expect(1 + 1).toBe(2)
  });

})

