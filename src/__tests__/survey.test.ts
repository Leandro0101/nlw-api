import { app } from '../app'
import request from 'supertest'
import createConnection from '../database'

describe('Surveys', () => {
  
  beforeAll(async () => {
    const connection = await createConnection()
    await connection.runMigrations()
  })  
  
  test('Should be able to create a new survey', async () => {
    const response = await request(app).post('/surveys').send({
      title: 'title example',
      description: 'description example'
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
  })
})