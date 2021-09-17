const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');


// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()
})

describe('[POST] /register', () => {
  test('responds with a new user', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'jim', password: '1234' })
    expect(res.body).toMatchObject({ id: 1, username: 'jim' })
  })
  test('responds with a 422 on missing credentials', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'jim', password:'' })
    expect(res.status).toBe(422)
  })
})

describe('[POST] /login', () => {
  test('responds with the welcome message', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'jim', password: '1234' })
    expect(res.body).toMatchObject({ message: `welcome, jim`})
  })
  test('responds with invalid credentials message', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'jim', password:'' })
    expect(res.body).toMatchObject({ message: 'invalid credentials'})
  })
})

describe('[GET] /jokes', () => {
  let res
  beforeEach(async () => {
    res = await request(server).get('/api/jokes')
  })
  test('responds with token message', async () => {
    expect(res.body).toMatchObject({ message: 'Token required'})
  })
  test('responds with all the jokes', async () => {
    // how do I bring in the token here to allow proper access to jokes?
    expect(res.body).toHaveLength(3)
    expect(res.body).toMatchObject([
      {
        "id": "0189hNRf2g",
        "joke": "I'm tired of following my dreams. I'm just going to ask them where they are going and meet up with them later."
    },
    {
        "id": "08EQZ8EQukb",
        "joke": "Did you hear about the guy whose whole left side was cut off? He's all right now."
    },
    {
        "id": "08xHQCdx5Ed",
        "joke": "Why didn’t the skeleton cross the road? Because he had no guts."
    }
    ])
  })
})
