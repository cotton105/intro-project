const Database = require( "better-sqlite3" )

const config = require( "../config" )
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

/**
 * Populate the Database with sample data.
 */
function populatedb() {
  /**
   * @type { Array< person > }
   */
  const people = [
    { id: 1, name: "Kermit Frog", email: null, schedule: null, landlord: null, room: null, notes: null },
    { id: 2, name: "Miss Piggy", email: null, schedule: null, landlord: null, room: null, notes: null },
  ]

  const db = new Database( config.dbpath, { fileMustExist: true } )
  const sql = db.prepare(
    "INSERT INTO `People`('id','name','email','schedule','landlord','room','notes')" +
    "VALUES ($id,$name,$email,$schedule,$landlord,$room,$notes)"
  )
  for( const person of people ) {
    try {
      const info = sql.run( person )
      console.log( info )
    } catch ( err ) {
      console.error( err )
    }
  }
  db.close()
}

/**
 * Demo function to return an array of people objects
 * @returns { Promise< Array< person > > }
 */
async function get() {
  const db = new Database( config.dbpath, { fileMustExist: true } )
  const sql = db.prepare( "SELECT * FROM People" )
  const rows = sql.all()
  db.close()
  if( 0 === rows.length ) {
    populatedb()
    return await get()
  }
  return rows
}

/**
 * Demo function adding a person
 * @param { string } parsedurl
 * @param { string } method
 * @param { person } person
 * @return { Promise < object > }
 */
async function add( parsedurl, method, person ) {
  const db = new Database( config.dbpath, { fileMustExist: true } )
  // Ensure all properties are included in the `person` object (avoids DB error).
  person = {
    id: person.id,
    name: person.name,
    email: person.email,
    schedule: person.schedule,
    landlord: person.landlord,
    room: person.room,
    notes: person.notes
  }

  nullifyemptyproperties( person )
  const people = await get()

  if( undefined !== person.id ) {
    people.some( element => {
      if( element.id === person.id ) {
        const sql = db.prepare(
          "UPDATE `People` " +
          "SET name = $name, email = $email, schedule = $schedule, landlord = $landlord, room = $room, notes = $notes " +
          "WHERE id = $id"
        )
        try {
          const info = sql.run( person )
          console.log( info )
        } catch ( err ) {
          console.error( err )
        }
        db.close()
      }
      return false
    } )
    return person
  }

  const sql = db.prepare(
    "INSERT INTO `People`('name','email','schedule','landlord','room','notes') " +
    "VALUES ($name,$email,$schedule,$landlord,$room,$notes)"
  )
  try {
    const info = sql.run( person )
    console.log( info )
    people.push( person )
  } catch ( err ) {
    console.error( err )
  }
  db.close()
  return person
}


module.exports = {
  get,
  add
}