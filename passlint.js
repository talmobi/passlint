var fs = require( 'fs' )
var path = require( 'path' )
var check = require( 'syntax-error' )

module.exports = function ( file, ecmaVersion ) {
  var text = fs.readFileSync( path.resolve( file ), 'utf8' )

  var err = check( text, file, {
    ecmaVersion: ecmaVersion
  } )

  if ( err ) {
    try {
      /*
       * Attempt to get a fuller error description
       * ( usually the last line of err.toString() )
       */
      var string = String( err )
      if ( string ) {
        var split = string.split( '\n' )
        split.forEach( function ( str ) {
          var a = str.toLowerCase()
          var b = err.message.toLowerCase()
          if ( a.indexOf( b ) >= 0 ) {
            err.message = str
          }
        } )
      }
    } catch ( err ) { /* ignore */ }

    // add 'error' to the error message if it doesn't exist
    if ( err.message.toLowerCase().indexOf( 'error' ) === -1 ) {
      err.message = ( 'error: ' + err.message )
    }

    return (
      '  ' + file + ':' + err.line + ':' + err.column + ': ' + err.message
    )
  }

  return ''
}
