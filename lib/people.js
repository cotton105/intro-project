const sqlite3 = require( "sqlite3" ).verbose()

const config = require( "../config" )
const { closedatabase, checkerror } = require( "../util/database" )
const { nullifyemptyproperties } = require( "../util/objects" )

/**
 * @typedef { Object } person
 * @property { number } id
 * @property { string } name - The name of the person.
 * @property { string } email - The email address of the person.
 * @property { number } schedule - The id of the schedule of the person.
 * @property { number } landlord - The id of the person who is the landlord of this person.
 * @property { number } room - The id of the room of the person.
 * @property { string } [ notes ] - Additional notes about the person (optional).
 */

function populatedb( db ) {
  /**
   * @type { Array< person > }
   */
  const people = [
    { id: 1, name: "Kermit Frog", email: null, schedule: null, landlord: null, room: null, notes: null },
    { id: 2, name: "Miss Piggy", email: null, schedule: null, landlord: null, room: null, notes: null },
  ]
  const sql = "INSERT INTO `People`('id','name','email','schedule','landlord','room','notes')" +
    "VALUES (?,?,?,?,?,?,?)"
  for( const person of people ) {
    db.run( sql, [ person.id, person.name, person.email, person.schedule, person.landlord, person.room, person.notes ], function ( err ) {
      if( err ) {
        return console.error( err )
      }
      console.log( `Successfully inserted row with id ${this.lastID}.` )
    } )
  }
}

/**
 * Demo function to return an array of people objects
 * @returns { Promise< Array< person > > }
 */
async function get() {
  const db = new sqlite3.Database( config.dbpath, sqlite3.OPEN_READWRITE, checkerror )

  const sql = "SELECT * FROM People"
  return new Promise( ( resolve, reject ) => {
    db.all( sql, function ( err, rows ) {
      if( err ) {
        return reject( console.error( err ) )
      }
      // Populate the database with example data if 'People' table is empty
      if( 0 === rows.length ) {
        populatedb( db )
        return resolve( get() )
      }
      resolve( rows )
    } )

    db.close( function ( err ) {
      if( err ) {
        return reject( console.error( err ) )
      }
    } )
  } )
}

/**
 * Demo function adding a person
 * @param { string } parsedurl
 * @param { string } method
 * @param { person } person
 * @return { Promise < object > }
 */
async function add( parsedurl, method, person ) {
  const db = new sqlite3.Database( config.dbpath, sqlite3.OPEN_READWRITE, checkerror )

  nullifyemptyproperties( person )
  const people = await get()

  if( undefined !== person.id ) {
    people.some( element => {
      if( element.id === person.id ) {
        const updatedperson = {
          $id: person.id,
          $name: person.name,
          $email: person.email,
          $schedule: person.schedule,
          $landlord: person.landlord,
          $room: person.room,
          $notes: person.notes
        }
        const sql = "UPDATE `People` " +
        "SET name = $name, email = $email, schedule = $schedule, landlord = $landlord, room = $room, notes = $notes " +
        "WHERE id = $id"
        db.run( sql, updatedperson, function ( err ) {
          if( err ) {
            return console.error( err )
          }
          console.log( `Successfully updated row with id ${person.id}.` )
        } )
        return true
      }
      return false
    } )
    return person
  }

  const sql = "INSERT INTO `People`('name','email','schedule','landlord','room','notes')" +
    "VALUES (?,?,?,?,?,?)"
  db.run( sql, [ person.name, person.email, person.schedule, person.landlord, person.room, person.notes ], function ( err ) {
    if( err ) {
      return console.error( err )
    }
    console.log( `Successfully inserted row with id ${this.lastID}.` )
  } )
  people.push( person )

  closedatabase( db )
  return person
}


module.exports = {
  get,
  add
}