import app from '../src/app'
import request from 'supertest'

describe('index', function() {
  it('should be return ok', async () => {
    await request(app)
      .get('/')
      .send()
      .expect(200)
  })

})
