const sqlite3 = require( "sqlite3" ).verbose()

const config = require( "../config" )

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

/**
 * @type { Array< person > }
 */
const people = [
  { id: 1, name: "Kermit Frog", email: null, schedule: null, landlord: null, room: null, notes: null },
  { id: 2, name: "Miss Piggy", email: null, schedule: null, landlord: null, room: null, notes: null },
]

function populatedb( db ) {
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
  const db = new sqlite3.Database( config.dbpath, sqlite3.OPEN_READWRITE, function ( err ) {
    if( err ) {
      return console.error( err )
    }
    console.log( "Opened Database for querying." )
  } )

  const sql = "SELECT * FROM PEOPLE"
  return new Promise( ( resolve, reject ) => {
    db.all( sql, function ( err, rows ) {
      if( err ) {
        return reject( console.error( err ) )
      }
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
      console.log( "Closed database connection." )
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
  if( undefined !== person.id ) {
    people.some( element => {
      if( element.id === person.id ) {
        element.name = person.name
        element.email = person.email
        element.landlord = person.landlord
        element.building = person.building
        element.notes = person.notes
        return true
      }
      return false
    } )
    return person
  }

  person.id = people.reduce( ( maxid, obj ) => {
    return Math.max( maxid, obj.id )
  }, -Infinity ) + 1

  people.push( person )

  return person
}


module.exports = {
  get,
  add
}