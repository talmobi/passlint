#!/usr/bin/env node

var fs = require( 'fs' )
var check = require( 'syntax-error' )

var argv = require( 'minimist' )( process.argv.slice( 2 ), {
  alias: {
    'ecmaVersion': [ 'e', 'ev', 'ecma', 'ecmaversion', 'ecma-version' ]
  },
  default: {
    'ecmaVersion': 6 // 2015
  }
} )


if ( argv._.length <= 0 ) {
  argv._ = argv._.concat( require( 'glob' ).sync( '**/*.js' ) ) // default all js files
}

var buffer = ''
var exitCode = 0
argv._.forEach( function ( file ) {
  var text = fs.readFileSync( file, 'utf8' )
  var err = check( text, file, {
    ecmaVersion: argv[ 'ecmaVersion' ]
  } )

  if ( err ) {
    buffer += (
      '  ' + file + ':' + err.line + ':' + err.column + ': ' + err.message + '\n'
    )
  }
} )

process.stderr.write( buffer )

if ( buffer === '' ) {
  process.exit( 0 ) // no errors
} else {
  process.exit( 1 )
}

