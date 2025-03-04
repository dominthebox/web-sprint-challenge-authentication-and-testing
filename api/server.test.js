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
      .send({ username: 'jim', password:'54321' })
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
  test('responds with a 200 ok', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'jim', password: '1234' })
      .then((res) => {
        res.body.token;
      })
    expect(res.body.status).toBe(200)
  })
})
