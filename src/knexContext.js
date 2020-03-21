const knex = require('knex')

const db = knex({
    client: 'pg', 
    connection: (process.env.NODE_ENV === 'test') ? process.env.TEST_DB_URL : process.env.DATABASE_URL
})

module.exports = db