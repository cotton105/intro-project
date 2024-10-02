require( "../index" )

const assert = require( "assert" )
const fs = require( "fs/promises" )
const Database = require( "better-sqlite3" )

const config = require( "../config" )
const { attributesmatch } = require( "../util/objects" )
const { initdatabase } = require( "../db/schema" )

const homepageurl = `http://localhost:${config.port}`

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
    const putrequest = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify( person )
    }
    const putresponse = await fetch( `${homepageurl}/api/people`, putrequest )
    if( !putresponse.ok ) {
      throw new Error( putresponse )
    }
    const getresponse = await fetch( `${homepageurl}/api/people` )
    if( !getresponse.ok ) {
      throw new Error( getresponse )
    }
    let retrievedperson = await getresponse.json()
    retrievedperson = retrievedperson[retrievedperson.length - 1]
    assert( attributesmatch( person, retrievedperson ) )
  } )

  it( "should accept edits to existing entries", async function () {
    const person = {
      id: 1,
      name: "test (edited)",
      email: "editedtest@test.com",
      notes: "Edited by Unit testing"
    }
    const putrequest = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify( person )
    }
    const putresponse = await fetch( `${homepageurl}/api/people`, putrequest )
    if( !putresponse.ok ) {
      throw new Error( putresponse )
    }
    const getresponse = await fetch( `${homepageurl}/api/people` )
    if( !getresponse.ok ) {
      throw new Error( getresponse )
    }
    let retrievedperson = await getresponse.json()
    retrievedperson = retrievedperson.filter( person => 1 === person.id )[0]
    assert( attributesmatch( person, retrievedperson ) )
  } )

  it ( "should accept record deletion", async function () {
    const personid = 1
    const deleterequest = { method: "DELETE" }
    const deleteresponse = await fetch( `${homepageurl}/api/people/${personid}`, deleterequest )
    if( !deleteresponse.ok ) {
      throw new Error( deleteresponse )
    }
    const getresponse = await fetch( `${homepageurl}/api/people` )
    if( !getresponse.ok ) {
      throw new Error( getresponse )
    }
    let retrievedperson = await getresponse.json()
    retrievedperson = retrievedperson[personid - 1]
    assert( 0 === Object.keys( retrievedperson ).length && retrievedperson.constructor === Object )
  } )
} )
