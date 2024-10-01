require( "../index" )

const assert = require( "assert" )

const { attributesmatch } = require( "../util/objects" )

describe( "Backend API tests", function () {
  it( "should generate an empty database on first startup", async function () {
    throw new Error( "Unimplemented test." )
  } )

  it( "should accept new entries", async function () {
    const person = {
      name: "test",
      email: "test@test.com",
      notes: "test"
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
      id: 2,
      name: "Miss Piggy",
      email: "misspiggy@example.com",
      notes: "Pig"
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
    retrievedPerson = retrievedPerson.filter( e => 2 === e.id )[0]
    assert( attributesmatch( person, retrievedPerson ) )
  } )

  it ( "should accept record deletion", async function () {
    throw new Error( "Unimplemented test." )
  } )
} )
