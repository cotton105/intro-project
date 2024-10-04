

import { getdata, putdata, deletedata } from "./api.js"
import { showform, getformfieldvalue, setformfieldvalue, clearform, gettablebody, cleartablerows } from "./form.js"
import { findancestorbytype } from "./dom.js"

document.addEventListener( "DOMContentLoaded", async function() {

  document.getElementById( "addperson" ).addEventListener( "click", addpersoninput )
  await gopeople()
} )


/**
 * Call api function to retrieve list of people.
 * @returns { Promise< object > }
 */
async function fetchpeople() {
  return await getdata( "people" )
}

/**
 * Call api function to add a new user.
 * @param { string } name
 * @param { string } email
 * @param { string } landlord
 * @param { string } building
 * @param { string } notes
 * @returns { Promise< object > }
 */
async function addperson( name, email, landlord, building, notes ) {
  await putdata( "people", { name, email, landlord, building, notes } )
}

/**
 * Call api function to update user details.
 * @param { string } id
 * @param { string } name
 * @param { string } email
 * @param { string } landlord
 * @param { string } building
 * @param { string } notes 
 */
async function updateperson( id, name, email, landlord, building, notes ) {
  await putdata( "people", { id, name, email, landlord, building, notes } )
}

/**
 * Removes a person from the database with the given id
 * @param { string } id 
 */
async function deleteperson( id ) {
  await deletedata( "people", { id } )
}

/**
 * Refresh the table of people.
 * @returns { Promise }
 */
async function gopeople() {
  const p = await fetchpeople()
  cleartablerows( "peopletable" )

  for( const pi in p ) {
    addpersondom( p[ pi ] )
  }
}

/**
 * Handle adding a new user.
 */
function addpersoninput() {

  clearform( "personform" )
  showform( "personform", async () => {

    await addperson( getformfieldvalue( "personform-name" ), 
                      getformfieldvalue( "personform-email" ), 
                      getformfieldvalue( "personform-landlord" ), 
                      getformfieldvalue( "personform-room" ), 
                      getformfieldvalue( "personform-notes" ) )
    await gopeople()
  } )
}

/**
 * Handle user editing.
 * @param { PointerEvent } ev 
 */
function editperson( ev ) {

  clearform( "personform" )
  const personrow = findancestorbytype( ev.target, "tr" )
  setformfieldvalue( "personform-name", personrow.person.name )
  setformfieldvalue( "personform-email", personrow.person.email )
  setformfieldvalue( "personform-landlord", personrow.person.landlord )
  setformfieldvalue( "personform-room", personrow.person.room )
  setformfieldvalue( "personform-notes", personrow.person.notes )

  showform( "personform", async () => {
    await updateperson(personrow.person.id,
                        getformfieldvalue("personform-name"),
                        getformfieldvalue("personform-email"),
                        getformfieldvalue("personform-landlord"),
                        getformfieldvalue("personform-room"),
                        getformfieldvalue("personform-notes"))
    await gopeople()
  } )
}

/**
 * Handle user deletion.
 * @param { PointerEvent } ev 
 */
async function deletepersoninput( ev ) {
  const personrow = findancestorbytype( ev.target, "tr" )
  document.getElementById( "deletepopupmessage" ).innerHTML = `Are you sure you want to delete <em>${personrow.person.name}</em> with ID ${personrow.person.id}?`
  showform( "confirmdeletionform", async () => {
    await deleteperson( personrow.person.id )
    await gopeople()
  } )
}

/**
 * Adds person information to the table.
 * @param { object } person
 */
export function addpersondom( person ) {

  const table = gettablebody( "peopletable" )
  const newrow = table.insertRow()

  const cells = []
  for( let i = 0; i < ( 5 + 7 ); i++ ) {
    cells.push( newrow.insertCell( i ) )
  }

  // @ts-ignore
  newrow.person = person
  cells[ 0 ].innerText = person.name
  cells[ 8 ].innerText = person.landlord
  cells[ 9 ].innerText = person.room
  cells[ 10 ].innerText = person.building

  const editbutton = document.createElement( "button" )
  editbutton.textContent = "Edit"
  editbutton.className = "editperson"
  editbutton.addEventListener( "click", editperson )

  const deletebutton = document.createElement( "button" )
  deletebutton.textContent = "Delete"
  deletebutton.className = "deleteperson"
  deletebutton.addEventListener( "click", deletepersoninput )

  cells[ 11 ].appendChild( editbutton )
  cells[ 11 ].appendChild( deletebutton )
}
