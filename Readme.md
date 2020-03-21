# Bookmarks server!

Nodejs server with CRUD functionality.

All actions are executed against a PostgreSQL local DB.

Packages used: express, node-fetch, morgan, cors, dotenv, helmet, winston, xss, postgreSQL, knex.


## Set up

Complete the following steps to start a new project (NEW-PROJECT-NAME):

1. Clone this repository to your local machine `git clone https://github.com/rodrigohervas/bookmarks-server.git NEW-PROJECT-NAME`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -r -Force .git` and then `git init`
4. Make sure that the .gitignore file is encoded as 'UTF-8'
5. Install the node dependencies `npm install`
6. Add an `.env` file with the following content:
    1. NODE_ENV='development'
    2. PORT=4000
    3. API_KEY=[YOUR_KEY_HERE]
       * Get yours here: https://www.uuidgenerator.net/
    4. REMOTE_SERVER_API_KEY: [YOUR_KEY_HERE]
       * Get yours here: https://tf-ed-bookmarks-api.herokuapp.com/
7. Edit the contents of the `package.json` to use NEW-PROJECT-NAME instead of `"name": "bookmarks-server",`

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`
