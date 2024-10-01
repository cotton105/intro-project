const Database = require( "better-sqlite3" )

const config = require( "../config.js" )

/**
 * Initialise the Database tables with the correct schema if they don't already exist.
 */
async function initdatabase() {
  const db = new Database( config.dbpath )
  const createtables = [
    `CREATE TABLE IF NOT EXISTS "Buildings" (
      "id"	INTEGER NOT NULL UNIQUE,
      "name"	TEXT NOT NULL,
      PRIMARY KEY("id" AUTOINCREMENT)
	  )`,
    `CREATE TABLE IF NOT EXISTS "People" (
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
    )`,
    `CREATE TABLE IF NOT EXISTS "Rooms" (
      "id"	INTEGER NOT NULL UNIQUE,
      "name"	TEXT,
      "building"	INTEGER NOT NULL,
      FOREIGN KEY("building") REFERENCES "Buildings"("id"),
      PRIMARY KEY("id" AUTOINCREMENT)
	  )`,
    `CREATE TABLE IF NOT EXISTS "Schedules" (
      "id"	INTEGER NOT NULL UNIQUE,
      "monday"	TEXT,
      "tuesday"	TEXT,
      "wednesday"	TEXT,
      "thursday"	TEXT,
      "friday"	TEXT,
      "saturday"	TEXT,
      "sunday"	TEXT,
      PRIMARY KEY("id" AUTOINCREMENT)
	  )`
  ]
  for( const sql of createtables ) {
    db.prepare( sql ).run()
  }
  db.close()
}

module.exports = {
  initdatabase
}