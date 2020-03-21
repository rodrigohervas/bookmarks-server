const app = require('../src/app')

describe('app', () => {
    it(`GET /api/ responds with 200 and message 'Welcome to bookmarks'`, () => {
        return supertest(app)
                .get('/api/')
                .set('authorization', `Bearer ${process.env.API_KEY}`)
                .expect(200, '"Welcome to bookmarks"')
    })
})