const sqlite3 = require( "sqlite3" ).verbose()

const config = require( "../config.js" )
const { closedatabase } = require( "../util/database.js" )

const db = new sqlite3.Database( config.dbpath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, ( err ) => {
  if( err ) {
    return console.error( err )
  }
  console.log( `Connected to SQLite database at ${config.dbpath}.` )
} )

const schemastatement = `CREATE TABLE IF NOT EXISTS "Buildings" (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "People" (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL,
	"email"	TEXT,
	"schedule"	INTEGER,
	"landlord"	INTEGER,
	"building"	INTEGER,
	"room"	INTEGER,
	"notes"	TEXT,
	FOREIGN KEY("building") REFERENCES "Buildings"("id"),
	FOREIGN KEY("schedule") REFERENCES "Schedules"("id"),
	FOREIGN KEY("landlord") REFERENCES "People"("id"),
	FOREIGN KEY("room") REFERENCES "Rooms"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "Rooms" (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT,
	"building"	INTEGER NOT NULL,
	FOREIGN KEY("building") REFERENCES "Buildings"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "Schedules" (
	"id"	INTEGER NOT NULL UNIQUE,
	"monday"	TEXT,
	"tuesday"	TEXT,
	"wednesday"	TEXT,
	"thursday"	TEXT,
	"friday"	TEXT,
	"saturday"	TEXT,
	"sunday"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);`

db.exec( schemastatement, function ( err ) {
  if( err ) {
    return console.error( err )
  }
  console.log( "Successfully initialised Database." )
} )

closedatabase( db )