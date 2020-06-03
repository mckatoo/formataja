import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

prisma.user.create({
  data: {
    name: 'Milton',
    email: 'mckatoo@gmail.com'
  }
}).then(() => {
  console.log('cadastrou')
})
