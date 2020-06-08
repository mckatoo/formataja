import request from 'supertest'
import app from '../src/app'

describe('Access', function() {
  test('should be return status code 200', async function() {
    const response = await request(app).get('/')
    expect(response.status).toBe(200)
  })
})
