function closedatabase ( db ) {
  db.close( checkerror )
}

function checkerror( err ) {
  if( err ) {
    return console.error( err )
  }
}

module.exports = {
  closedatabase,
  checkerror,
}