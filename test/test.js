require( "../index" )

const assert = require( "assert" )

describe( "Api tests", function () {
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
    for( const attribute of Object.keys( person ) ) {
      assert( person[attribute] === retrievedPerson[attribute] )
    }
  } )

  it( "should accept edits to existing entries", async function () {
    throw new Error( "Unimplemented test" )
  } )

  it ( "should accept record deletion", async function () {
    throw new Error( "Unimplemented test" )
  } )
} )
