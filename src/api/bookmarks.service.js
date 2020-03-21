const config = require('../config')
const logger = require('../logger')
const { isWebUri } = require('valid-url')
const db = require('../knexContext')
const xss = require('xss')

const serializeBookmark = (bookmark) => (
    {
        id: bookmark.id,
        title: xss(bookmark.title), 
        description: xss(bookmark.description), 
        url: xss(bookmark.url), 
        rating: bookmark.rating
    }
)

const BookmarksService = {

    all(req, res, next){
        try {
            const method = req.method
            const id = req.params.id
            const verbs = ['PUT', 'PATCH', 'DELETE']

            if( verbs.includes(method) && isNaN(id) ) {
                throw( {message: 'id is mandatory and must be a valid number', status: 400 } )
            }

            next()
        } 
        catch (error) {
            throw ({ 
                message: error.message, 
                status: error.status, 
                loc: 'at bookmarks.service.All', 
                internalMessage: error.message
            })            
        }
    },
    
    getAll(req, res, next) {
        try{
            return db
                .select('*')
                .from('bookmarks')
                .then(bookmarks => 
                    res
                    .status(200)
                    .json( bookmarks.map(serializeBookmark) )
                )
                .catch(error => {
                    logger.error(`${error.message} at bookmarks.service.getAll`)
                    next( { message: error.message, status: error.status } )
                })
        }
        catch (error) {
            throw ({ 
                message: 'error getting bookmarks', 
                status: error.status, 
                loc: 'at bookmarks.service.getAll', 
                internalMessage: error.message
            })
        }
    },

    getById(req, res, next) {
        try {
            const id = req.params.id
            if( isNaN(id) ) {
                throw( {message: 'id is mandatory and must be a valid number', status: 400 } )
            }

            return db
                .select('*')
                .from('bookmarks')
                .where('id', id)
                .first()
                .then(bookmark => {
                    if(!bookmark) {
                        throw ( { message: `Bookmark doesn't exist`, status: 404 } )
                    }
                    res.status(200).json( serializeBookmark(bookmark) )
                })
                .catch( error => {
                    logger.error(`${error.message} at bookmarks.service.getById`)
                    next( { message: error.message, status: error.status } )
                })
        }
        catch(error) {
            throw ({
                message: 'error getting bookmark', 
                status: error.status, 
                loc: 'at bookmarks.service.getById', 
                internalMessage: error.message
            })
        }
    },

    post(req, res, next) {
        try {

            const {title, url, description, rating} = req.body
            const bookmark = {
                title: title, 
                description: description, 
                url: url, 
                rating: rating
            }

            if (!title) {
                throw( {message: 'title is mandatory', status: '400'} )
            }
            if (!url) {
                throw( {message: 'url is mandatory', status: '400'} )
            }
            if(!isWebUri(url)) {
                throw( {message: 'url must have a valid format', status: '400'} )
            }
            if (!rating) {
                throw( {message: 'rating is mandatory', status: '400'} )
            }
            if(isNaN(rating) || rating < 0 || rating > 5) {
                throw( {message: 'rating must be a number, and between 1 and 5', status: '400'} )
            }
        
            return db
                .insert(bookmark)
                .into('bookmarks')
                .returning('*')
                .then(bookmarks => {
                    const bookmark = bookmarks[0]
                    res
                    .status(201)
                    .location(`/bookmarks/${bookmark.id}`)
                    .json( serializeBookmark(bookmark) )
                })
                .catch( error => {
                    logger.error(`${error.message} at bookmarks.service.post`)
                    next( { message: error.message, status: error.status } )
                })
        }
        catch (error) {
            throw ({
                message: 'error creating bookmark', 
                status: error.status, 
                loc: 'at bookmarks.service.post', 
                internalMessage: error.message
            })
        }
    },

    putById(req, res, next) {
        try {
            const {title, url, description, rating} = req.body
            const id = req.params.id
            const bookmark = {
                title: title, 
                description: description, 
                url: url, 
                rating: rating
            }
            
            if (!id) {
                throw( {message: 'id is mandatory', status: '400'} )
            }
            if (!title) {
                throw( {message: 'title is mandatory', status: '400'} )
            }
            if (!url) {
                throw( {message: 'url is mandatory', status: '400'} )
            }
            if(!isWebUri(url)) {
                throw( {message: 'url must have a valid format', status: '400'} )
            }
            if (!description) {
                throw( {message: 'description is mandatory', status: '400'} )
            }
            if (!rating) {
                throw( {message: 'rating is mandatory', status: '400'} )
            }
            if(isNaN(rating) || rating < 0 || rating > 5) {
                throw( {message: 'rating must be a number, and between 1 and 5', status: '400'} )
            }
        
            return db
                .from('bookmarks')
                .where('id', id)
                .update(bookmark, '*')
                .then(bookmark => {
                    if(!bookmark) {
                        throw ( { message: `Bookmark doesn't exist`, status: 404 } )
                    }
                    res.status(204).end()
                })
                .catch( error => {
                    logger.error(`${error.message} at bookmarks.service.putById`)
                    next( { message: error.message, status: error.status } )
                })
        }
        catch (error) {
            throw ({
                message: 'error updating bookmark', 
                status: error.status, 
                loc: 'at bookmarks.service.putById', 
                internalMessage: error.message
            })
        }
    },

    patchById(req, res, next) {
        try {
            const {title, url, description, rating} = req.body
            const id = req.params.id
            const bookmark = {
                title: title, 
                description: description, 
                url: url, 
                rating: rating
            }
            
            if (!id) {
                throw( {message: 'id is mandatory', status: 400} )
            }

            if (!title && !url && !description && !rating) {
                throw ( { message: `Empty update request`, status: 400 } )
            }

            if(url && !isWebUri(url)) {
                throw( {message: 'url must have a valid format', status: 400} )
            }            
            
            if(rating && (isNaN(rating) || rating < 0 || rating > 5) ) {
                throw( {message: 'rating must be a number, and between 1 and 5', status: 400} )
            }
        
            return db
                .from('bookmarks')
                .where('id', id)
                .update(bookmark, '*')
                .then(bookmarks => {
                    if(!bookmarks.length) {
                        throw ( { message: `Bookmark doesn't exist`, status: 404 } )
                    }
                    res.status(204).end()
                })
                .catch( error => {
                    logger.error(`${error.message} at bookmarks.service.patchById`)
                    next( { message: error.message, status: error.status } )
                })
        }
        catch (error) {
            throw ({
                message: 'error updating bookmark', 
                status: error.status, 
                loc: 'at bookmarks.service.patchById', 
                internalMessage: error.message
            })
        }
    },

    deleteById(req, res, next) {
        try {
            const id = req.params.id
            if (!id) {
                throw( {message: 'id is mandatory', status: '400'} )
            }
        
            return db
                .from('bookmarks')
                .where('id', id)
                .del()
                .then(result => {
                    if(!result) {
                        throw ( {message: `Bookmark doesn't exist`, status: 404} )
                    }
                    res.status(200).json(`${result} bookmark deleted`)
                })
                .catch( error => {
                    logger.error(`${error.message} at bookmarks.service.deleteById`)
                    next( { message: error.message, status: error.status } )
                })
        }
        catch (error) {
            throw ({
                message: 'error deleting bookmark', 
                status: error.status, 
                loc: 'at bookmarks.service.deleteById', 
                internalMessage: error.message
            })
        }
    }

}

module.exports = BookmarksService