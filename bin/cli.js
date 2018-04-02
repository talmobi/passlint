#!/usr/bin/env node

var passlint = require( '../passlint.js' )

var argv = require( 'minimist' )( process.argv.slice( 2 ), {
  alias: {
    'ecmaVersion': [ 'e', 'ev', 'ecma', 'ecmaversion', 'ecma-version' ],
    'version': [ 'V' ],
    'help': [ 'h' ]
  },
  default: {
    'ecmaVersion': 6 // 2015
  }
} )

if ( argv[ 'help' ] ) {
  var _fs = require( 'fs' )
  var _path = require( 'path' )

  console.log(
    _fs.readFileSync(
      _path.join( __dirname, '../help.txt' ),
      'utf8'
    )
  )

  process.exit()
}

if ( argv[ 'version' ] ) {
  var pkg = require( '../package.json' )

  console.log(
    pkg.name + ' version: ' + pkg.version
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
    errline = passlint( file, argv[ 'ecmaVersion' ] )
  } catch ( err ) {
    console.error( err.message.trim() )
    process.exit( 1 )
  }

  if ( errline ) {
    // TODO wooster piping working
    buffer += ( errline + '\n' )
  }
} )

process.stderr.write( buffer )

if ( buffer === '' ) {
  process.exit( 0 ) // no errors
} else {
  process.exit( 1 )
}
