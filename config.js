const path = require( "path" )

let dbpath
if( undefined !== process.env.DB_PATH ) {
  dbpath = path.resolve( __dirname, process.env.DB_PATH )
} else if( "TEST" === process.env.NODE_ENV ) {
  dbpath = path.resolve( __dirname, "db", "database.test.db" )
} else {
  dbpath = path.resolve( __dirname, "db", "database.db" )
}

const config = {
  dbpath,
  port: process.env.PORT ?? 3000
}

module.exports = config
