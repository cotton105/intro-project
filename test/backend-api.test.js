require( "../index" )

const assert = require( "assert" )
const fs = require( "fs/promises" )
const Database = require( "better-sqlite3" )

const config = require( "../config" )
const { attributesmatch } = require( "../util/objects" )
const { initdatabase } = require( "../db/schema" )

describe( "Backend API tests", async function () {
  it( "should generate a valid database if missing", async function () {
    await fs.rm( config.dbpath )
    await initdatabase()
    const expectedtables = ["People", "Buildings", "Rooms", "Schedules"]
    const db = new Database( config.dbpath, { fileMustExist: true } )
    const sql = db.prepare( "SELECT name FROM sqlite_schema WHERE type = 'table' AND name NOT LIKE 'sqlite_%'" )
    const rows = sql.all()
    db.close()
    const retrievedtables = rows.map( row => row.name )
    for( const expectedtable of expectedtables ) {
      assert( retrievedtables.includes( expectedtable ) )
    }
  } )

  it( "should accept new entries", async function () {
    const person = {
      name: "test",
      email: "test@test.com",
      notes: "Added by Unit Testing"
    }
    const putRequest = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify( person )
    }
    const putResponse = await fetch( "http://localhost:3000/api/people", putRequest )
    if( !putResponse.ok ) {
      throw new Error( putResponse )
    }
    const getResponse = await fetch( "http://localhost:3000/api/people" )
    if( !getResponse.ok ) {
      throw new Error( getResponse )
    }
    let retrievedPerson = await getResponse.json()
    retrievedPerson = retrievedPerson[retrievedPerson.length - 1]
    assert( attributesmatch( person, retrievedPerson ) )
  } )

  it( "should accept edits to existing entries", async function () {
    const person = {
      id: 1,
      name: "test (edited)",
      email: "editedtest@test.com",
      notes: "Edited by Unit testing"
    }
    const putRequest = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify( person )
    }
    const putResponse = await fetch( "http://localhost:3000/api/people", putRequest )
    if( !putResponse.ok ) {
      throw new Error( putResponse )
    }
    const getResponse = await fetch( "http://localhost:3000/api/people" )
    if( !getResponse.ok ) {
      throw new Error( getResponse )
    }
    let retrievedPerson = await getResponse.json()
    retrievedPerson = retrievedPerson.filter( person => 1 === person.id )[0]
    assert( attributesmatch( person, retrievedPerson ) )
  } )

  it ( "should accept record deletion", async function () {
    throw new Error( "Unimplemented test." )
  } )
} )
