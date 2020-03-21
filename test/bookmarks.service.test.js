const app = require('../src/app')
const db = require('../src/knexContext')
const getBookmarks = require('./bookmarks.testData')

const testBookmarks = getBookmarks()
    
beforeEach('empty bookmarks table', () => db('bookmarks').truncate())

afterEach('empty bookmarks table', () => db('bookmarks').truncate())

after('close all connections to bookmarks-test db', () => db.destroy())



describe('GET /api/bookmarks', () => {

    context(`bookmarks table has data`, () => {
        beforeEach('insert test bookmarks into bookmarks table', () => {
            return db
                    .into('bookmarks')
                    .insert(testBookmarks)
        })

        it(`/getAll returns status 200 and a list of all bookmarks`, () => {
            return supertest(app)
                    .get('/api/bookmarks')
                    .set('Authorization', `Bearer ${process.env.API_KEY}`)
                    .expect(200)
                    .expect(testBookmarks)
        })

        it(`/getById with valid id returns status 200 and one bookmark`, () => {
            const id = 3
            return supertest(app)
                    .get(`/api/bookmarks/${id}`)
                    .set('Authorization', `Bearer ${process.env.API_KEY}`)
                    .expect(200)
                    .expect(testBookmarks[id - 1])
        })

        it(`/getById with wrong id status 404 and not found error message`, () => {
            const id = 654654654
            return supertest(app)
                    .get(`/api/bookmarks/${id}`)
                    .set('Authorization', `Bearer ${process.env.API_KEY}`)
                    .expect(404)
                    .expect( res => {
                        const error = res.body.error
                        expect(error.message).to.eql(`Bookmark doesn't exist`)
                    })
        })

        it(`/getById with invalid id status 400 and 'error getting bookmark' error message`, () => {
            const invalidId = 'lkiujh'
            return supertest(app)
                    .get(`/api/bookmarks/${invalidId}`)
                    .set('authorization', `Bearer ${process.env.API_KEY}`)
                    .expect(400)
                    .then(res => {
                        const error = res.body.error
                        expect(error.message).to.eql('error getting bookmark')
                    })
        })
    })

    context(`bookmarks table is empty`, () => {
        it(`/getAll returns status 404 and an empty list`, () => {
            return supertest(app)
                    .get('/api/bookmarks')
                    .set('Authorization', `Bearer ${process.env.API_KEY}`)
                    .expect(200)
                    .expect([])
        })

        it(`/getById returns status 404 and not found error message`, () => {
            const id = 3
            return supertest(app)
                    .get(`/api/bookmarks/${id}`)
                    .set('Authorization', `Bearer ${process.env.API_KEY}`)
                    .expect(404)
                    .expect(res => {
                        const error = res.body.error
                        expect(error.message).to.eql(`Bookmark doesn't exist`)
                    })
        })
    })
})




describe(`POST /api/bookmarks`, () => {
    
    it('creates a bookmark, responding with 201 and the new article', () => {
        const bookmark = {
            "title": "Test Bookmark 1",
            "description": "Test description for Bookmark 1 ",
            "url": 'https://google.org/test1',
            "rating": 1
        }

        return supertest(app)
                .post('/api/bookmarks')
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .send(bookmark)
                .expect(201)
                .expect(res => {
                    expect(res.body.title).to.eql(bookmark.title)
                    expect(res.body.description).to.eql(bookmark.description)
                    expect(res.body.url).to.eql(bookmark.url)
                    expect(res.body.rating).to.eql(bookmark.rating)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/bookmarks/${res.body.id}`)
                })
                .catch( error  => {
                    throw('Error: ', error);
                })
    })

    it(`returns 400 and message 'error creating bookmark' when title is missing`, () => {
        const bookmark = {
            //"title": "Test Bookmark 1",
            "description": "Test description for Bookmark 1 ",
            "url": 'https://google.org/test1',
            "rating": 1
        }

        return supertest(app)
                .post('/api/bookmarks')
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .send(bookmark)
                .expect(400)
                .expect(res => {
                    const error = res.body.error
                    expect(error.message).to.eql('error creating bookmark')
                    expect(error.status).to.eql('400')
                })
                .catch( error  => {
                    throw('Error: ', error);
                })
    })

    it(`returns 400 and message 'error creating bookmark' when rating is not a number or is not between 1 and 5`, () => {
        const bookmark = {
            "title": "Test Bookmark 1",
            "description": "Test description for Bookmark 1 ",
            "url": 'https://google.org/test1',
            "rating": '7'
        }

        return supertest(app)
                .post('/api/bookmarks')
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .send(bookmark)
                .expect(400)
                .expect(res => {
                    const error = res.body.error
                    expect(error.message).to.eql('error creating bookmark')
                    expect(error.status).to.eql('400')
                })
                .catch( error  => {
                    throw('Error: ', error);
                })        
    })
})




describe(`DELETE /api/bookmarks`, () => {
    beforeEach('inserts bookmarks in DB', () => {
        return db
                .into('bookmarks')
                .insert(testBookmarks)
    })

    context(`Given that there's data in the DB`, () => {
        it(`deletes a bookmark and returns 200 and message '1 bookmark deleted' when id exists`, () => {
            const bookmarkId = 1
            const bookmarks = testBookmarks.filter(bookmark => bookmark.id !== bookmarkId)
            return supertest(app)
                    .delete(`/api/bookmarks/${bookmarkId}`)
                    .set('authorization', `Bearer ${process.env.API_KEY}`)
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.eql('1 bookmark deleted')
                        supertest(app)
                            .get('/bookmarks')
                            .set('authorization', `Bearer ${process.env.API_KEY}`)
                            .expect(testBookmarks)
                    })
        })

        it(`id must be present in delete request`, () => {
            return supertest(app)
                    .delete(`/api/bookmarks/`)
                    .set('authorization', `Bearer ${process.env.API_KEY}`)
                    .expect(400)
                    .then(res => {
                        const error = res.body.error
                        expect(error.message).to.eql('id is mandatory and must be a valid number')
                    })
        })
    })
    
    context(`Given that there's data in the DB`, () => {

        it(`returns 404 and message 'Bookmark doesn't exist' when id doesn't exist`, () => {
            const bookmarkId = 654654
            return supertest(app)
                    .delete(`/api/bookmarks/${bookmarkId}`)
                    .set('authorization', `Bearer ${process.env.API_KEY}`)
                    .expect(404)
                    .expect( res => {
                        const error = res.body.error
                        expect(error.message).to.eql(`Bookmark doesn't exist`)
                    })
        })
    })
})



describe(`PATCH /api/bookmarks`, () => {
    beforeEach('insert bookmarks in DB', () => {
        return db
                .into('bookmarks')
                .insert(testBookmarks)
    })

    context(`There's data in DB`, () => {
        it(`id must be present in patch request`, () => {
            return supertest(app)
                    .patch(`/api/bookmarks/`)
                    .set('authorization', `Bearer ${process.env.API_KEY}`)
                    .expect(400)
                    .then(res => {
                        const error = res.body.error
                        expect(error.message).to.eql('id is mandatory and must be a valid number')
                    })
        })

        it(`it responds with 204 and no message when succesful`, () => {
            const bookmark = testBookmarks[0]
            return supertest(app)
                    .patch(`/api/bookmarks/${bookmark.id}`)
                    .send(bookmark)
                    .set('authorization', `Bearer ${process.env.API_KEY}`)
                    .expect(204)
        })

        it(`it responds with 204 and no message when succesfully doing a partial update `, () => {
            const bookmark = testBookmarks[0]
            bookmark.title = 'Test update title'
            return supertest(app)
                    .patch(`/api/bookmarks/${bookmark.id}`)
                    .send( {'title': bookmark.title} )
                    .set('authorization', `Bearer ${process.env.API_KEY}`)
                    .expect(204)
                    .then( () => {
                        return supertest(app)
                        .get(`/api/bookmarks/${bookmark.id}`)
                        .set('authorization', `Bearer ${process.env.API_KEY}`)
                        .then(res => {
                            const updatedBookmark = res.body
                            expect(bookmark.id).to.eql(updatedBookmark.id)
                            expect(bookmark.title).to.eql(updatedBookmark.title)
                            expect(bookmark.description).to.eql(updatedBookmark.description)
                        })
                    })
        })

        it(`it updates bookmark in table when succesful`, () => {
            const bookmark = {
                id: 1,
                title: 'Test update title',
                description: 'Test update description', 
                url: 'https://www.testurl.com/',
                rating: 3
            }

            return supertest(app)
                    .patch(`/api/bookmarks/${bookmark.id}`)
                    .send(bookmark)
                    .set('authorization', `Bearer ${process.env.API_KEY}`)
                    .then( () => {
                        return supertest(app)
                        .get(`/api/bookmarks/${bookmark.id}`)
                        .set('authorization', `Bearer ${process.env.API_KEY}`)
                        .then(res => {
                            const updatedBookmark = res.body
                            expect(bookmark).to.eql(updatedBookmark)
                        })
                    })
        })

        it(`it responds with 400 and error message 'error updating bookmark' when title, description, url and rating are missing`, () => {
            const bookmark = {
                id: 1                
            }
            return supertest(app)
                    .patch(`/api/bookmarks/${bookmark.id}`)
                    .send(bookmark)
                    .set('authorization', `Bearer ${process.env.API_KEY}`)
                    .expect(400)
                    .then( res => {
                        const error = res.body.error
                        expect(error.message).to.eql('error updating bookmark')
                    })
        })
    })
    
    context(`There's no data in DB`, () => {

        //it()
    })
})