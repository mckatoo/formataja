import faker from 'faker';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../../src/app';
import TokenService from '../../src/services/TokenService';

const { generateToken } = new TokenService();
const prisma = new PrismaClient();
const { users, formats } = prisma;
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
  password: '',
};

describe('Formats', function () {
  beforeAll(async () => {
    user = await users.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });
  });

  afterAll(async () => {
    await formats.deleteMany({
      where: {
        id_font: {
          gt: 0,
        },
      },
    });
    await prisma.disconnect();
  });

  it('Should return formats list', async () => {
    await formats.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        fonts: {
          create: {
            name: `${faker.name.firstName()} ${faker.name.lastName()}`,
          },
        },
      },
    });
    const response = await request(app)
      .get('/formats')
      .set('authorization', `Bearer ${generateToken({ id: user.id_user })}`);
    expect(response.status).toBe(200);
  });

  it('Should list formats by id', async () => {
    const format = await formats.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        fonts: {
          create: {
            name: `${faker.name.firstName()} ${faker.name.lastName()}`,
          },
        },
      },
      select: {
        id_format: true,
        name: true,
        fonts: true,
      },
    });
    const response = await request(app)
      .get(`/formats/id/${format.id_format}`)
      .set('authorization', `Bearer ${generateToken({ id: user.id_user })}`);
    expect(response.status).toBe(200);
    expect(response.body.format.name).toBe(format.name);
    expect(response.body.format.fonts.name).toBe(format.fonts.name);
  });

  it('Should list formats by name', async () => {
    const format = await formats.create({
      data: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        fonts: {
          create: {
            name: `${faker.name.firstName()} ${faker.name.lastName()}`,
          },
        },
      },
      select: {
        id_format: true,
        name: true,
        fonts: true,
      },
    });
    const response = await request(app)
      .get(`/formats/name/${format.name}`)
      .set('authorization', `Bearer ${generateToken({ id: user.id_user })}`);
    expect(response.status).toBe(200);
    // expect(response.body.formats.name).toBe(format.name);
    // expect(response.body.formats.fonts.name).toBe(format.fonts.name);
  });

  it('Should create and return format', async () => {
    const format = {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    }
    const response = await request(app)
      .post('/formats')
      .send(format)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${generateToken({ id: user.id_user })}`);
    expect(response.status).toBe(201);
    expect(response.body.format.name).toBe(format.name);
  });

  // it('Should return font updated with new token', async () => {
  //   const oldFont = await formats.create({
  //     data: {
  //       name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  //     },
  //   });
  //   const newFont = {
  //     name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  //   };
  //   const response = await request(app)
  //     .patch('/formats')
  //     .send({
  //       id_font: oldFont.id_font,
  //       name: newFont.name,
  //     })
  //     .set('Accept', 'application/json')
  //     .set('Authorization', `Bearer ${generateToken({ id: oldFont.id_font })}`);
  //   expect(response.status).toBe(202);
  //   expect(response.body.font.name).toBe(newFont.name);
  // });
  //
  // it('Should fail return font deleted', async () => {
  //   const font = await formats.create({
  //     data: {
  //       name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  //     },
  //   });
  //   const response = await request(app)
  //     .delete('/formats')
  //     .send({
  //       id_font: font.id_font,
  //     })
  //     .set('Accept', 'application/json')
  //     .set('Authorization', `Bearer ${generateToken({ id: user.id_user })}`);
  //   expect(response.status).toBe(204);
  // });
});
