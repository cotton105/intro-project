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
    assert(attributesMatch(person, retrievedPerson))
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
    const putResponse = await fetch("http://localhost:3000/api/people", putRequest)
    if (!putResponse.ok) {
      throw new Error(putResponse);
    }
    const getResponse = await fetch("http://localhost:3000/api/people")
    if (!getResponse.ok) {
      throw new Error(getResponse);
    }
    let retrievedPerson = await getResponse.json()
    retrievedPerson = retrievedPerson.filter(e => e.id === 2)[0]
    assert(attributesMatch(person, retrievedPerson))
  } )

  it ( "should accept record deletion", async function () {
    throw new Error( "Unimplemented test" )
  } )
} )

/**
 * Checks whether two objects have matching attributes. Only uses the `base` object's attributes,
 * so `compare` may include attributes that `base` doesn't.
 * @param {Object} base The object to base the comparison off.
 * @param {Object} compare The object to compare.
 * @returns Whether the attributes of the objects match.
 */
function attributesMatch(base, compare) {
  for( const attribute of Object.keys( base ) ) {
    if (base[attribute] !== compare[attribute]) {
      return false;
    }
  }
  return true;
}
