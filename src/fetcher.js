const nodeFetch = require('node-fetch')
const logger = require('./logger')

async function asyncFetchData(url, options) {
    
    const result = await nodeFetch(url, options)
    if(!result.ok){
        logger.error(`${error.message} at fetcher.asyncFetchData`)
        throw new Error(result.statusText)
    }
    const response = await result.json()
    const bookmarks = await response
    return bookmarks

}

function fetchData(url, options) {
    const data = nodeFetch(url, options)
        .then(response => {
            if(!response.ok){
                logger.error(`${error.message} at fetcher.fetchData`)
                throw new Error(response.statusText)
            }
            return response.json()
        })
        .then(bookmarks => {
            return bookmarks
        })
        .catch(error => {
            logger.error(`${error.message} at fetcher.fetchData`)
            throw( error )
    })

    return data
}

module.exports = {
    asyncFetchData, 
    fetchData
}