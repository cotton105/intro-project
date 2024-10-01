/**
 * Replaces empty strings in an object with `null`.
 * @param {object} object The Object to alter.
 */
function nullifyemptyproperties( object ) {
  for( const attribute of Object.keys( object ) ) {
    object[attribute] = "" === object[attribute] ? null : object[attribute]
  }
}

/**
 * Checks whether two objects have matching attributes. Only uses the `base` object's attributes,
 * so `compare` may include attributes that `base` doesn't.
 * @param {Object} base The object to base the comparison off.
 * @param {Object} compare The object to compare.
 * @returns Whether the attributes of the objects match.
 */
function attributesmatch( base, compare ) {
  for( const attribute of Object.keys( base ) ) {
    if( base[attribute] !== compare[attribute] ) {
      return false
    }
  }
  return true
}

module.exports = {
  nullifyemptyproperties,
  attributesmatch,
}
