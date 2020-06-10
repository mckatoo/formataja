import { PrismaClient } from '@prisma/client'
import faker = require('faker')
const factory = require('factory-girl').factory

const prisma = new PrismaClient()

const {
  formats,
  articles,
  users,
  fonts,
  topics
} = prisma

factory.define('User', users, {
  data: {
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    email: faker.internet.email(),
    password: faker.internet.password()
  }
})

module.exports = factory
