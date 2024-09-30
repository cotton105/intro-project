const path = require( "path" )

const config = {
  dbpath: process.env.DB_PATH ? path.resolve( __dirname, process.env.DB_PATH ) : path.resolve( __dirname,  "db", "database.db" ),
}

module.exports = config
