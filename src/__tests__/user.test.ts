import { app } from '../app'
import request from 'supertest'

describe('Users', () => {
  request(app).post('/users').send({
    email: 'user@gmail.com',
    name: 'user example'
  })
})