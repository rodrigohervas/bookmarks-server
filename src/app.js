require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const { NODE_ENV } = require('./config')
const helmet = require('helmet')
const cors = require('cors')
const bodyParser = require('body-parser')
const bookmarksRouter = require('./api/bookmarks.router')
const accessHandler = require('./access-handler')
const errorHandler = require('./error-handler')

const app = express()
const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common'

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(bodyParser.json())

//ACCESS SECURITY MIDDLEWARE
app.use(accessHandler)

//HOME ENDPOINT
app.route('/api/')
    .get((req, res) => {
        res.status(200).json('Welcome to bookmarks API')
    })

//BOOKMARKS ENDPOINT
app.use(bookmarksRouter)

//ERROR HANDLING MIDDLEWARE
app.use(errorHandler)


module.exports = app