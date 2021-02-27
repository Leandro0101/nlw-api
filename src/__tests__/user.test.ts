import { app } from '../app'
import request from 'supertest'
import createConnection from '../database'
import { getConnection } from 'typeorm'

describe('Users', () => {
  
  beforeAll(async () => {
    const connection = await createConnection()
    await connection.runMigrations()
  })  

  afterAll(async () => {
    const connection = getConnection()
    await connection.dropDatabase()
    await connection.close()
  })
  
  test('Should be able to create a new user', async () => {
    const response = await request(app).post('/users').send({
      email: 'user@gmail.com',
      name: 'user example'
    })

    expect(response.status).toBe(201)
  })

  test('Should not be to create a user with exists email', async () => {
    const response = await request(app).post('/users').send({
      email: 'user@gmail.com',
      name: 'user example'
    })

    expect(response.status).toBe(400)
  })
})