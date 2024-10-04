import { getdata, putdata, deletedata } from "./api.js"
import { showform, getformfieldvalue, setformfieldvalue, clearform, gettablebody, cleartablerows } from "./form.js"
import { findancestorbytype } from "./dom.js"

document.addEventListener( "DOMContentLoaded", async function() {
  document.getElementById( "personform-addroom" ).addEventListener( "click", addroominput )
} )

function addroominput() {
  clearform( "roomform" )
  showform( "roomform", async () => {
    await addroom( getformfieldvalue( "roomform-name" ),
                    getformfieldvalue( "roomform-building" ) )
  } )
}

/**
 * Call API function to add a new room.
 * @param { string } name 
 * @param { number } buildingid 
 */
async function addroom( name, buildingid ) {
  await putdata( "rooms", { name, buildingid } )
}
