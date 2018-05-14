#!/usr/bin/env node

var _passlint = require( '../passlint.js' )

var _fs = require( 'fs' )
var _path = require( 'path' )
var _pkg = require( '../package.json' )

var argv = require( 'minimist' )( process.argv.slice( 2 ), {
  alias: {
    'ecmaVersion': [ 'e', 'ev', 'ecma', 'ecmaversion', 'ecma-version' ],
    'version': [ 'V' ],
    'help': [ 'h' ]
  }
} )

if ( argv[ 'help' ] ) {
  console.log(
    _fs.readFileSync(
      _path.join( __dirname, '../help.txt' ),
      'utf8'
    )
  )

  process.exit()
}

if ( argv[ 'version' ] ) {
  console.log(
    _pkg.name + ' version: ' + _pkg.version
  )

  process.exit()
}

if ( argv._.length <= 0 ) {
  console.error( 'Error! no files supplied - try `passlint **/*.js`' )
  process.exit( 1 )
  // argv._ = argv._.concat( require( 'glob' ).sync( '**/*.js' ) ) // default all js files
}

var buffer = ''
argv._.forEach( function ( file ) {
  var errline

  try {
    var text = _fs.readFileSync( _path.resolve( file ), 'utf8' )
    errline = _passlint( text, argv[ 'ecmaVersion' ] )
  } catch ( err ) {
    console.error( err.message.trim() )
    process.exit( 1 )
  }

  if ( errline ) {
    // TODO wooster piping working
    buffer += ( '  ' + file + ':' + errline + '\n' )
  }
} )

process.stderr.write( buffer )

if ( buffer === '' ) {
  process.exit( 0 ) // no errors
} else {
  process.exit( 1 )
}
