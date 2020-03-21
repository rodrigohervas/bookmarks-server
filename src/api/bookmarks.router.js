const express = require('express')
const BookmarksService = require('./bookmarks.service')

const bookmarksRouter = express.Router()

bookmarksRouter
    .route('/api/bookmarks')
    .all(BookmarksService.all)
    .get(BookmarksService.getAll)
    .post(BookmarksService.post)
    

bookmarksRouter
    .route('/api/bookmarks/:id')
    .all(BookmarksService.all)
    .get(BookmarksService.getById)
    .put(BookmarksService.putById)
    .patch(BookmarksService.patchById)
    .delete(BookmarksService.deleteById)
    


module.exports = bookmarksRouter