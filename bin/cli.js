#!/usr/bin/env node

var parseArgs = require( 'minimist' )

// parse the command line arguments ( with minimist )
var argv = parseArgs( process.argv.slice( 2 ), {
  boolean: true
} )

var CLIEngine = require( 'eslint' ).CLIEngine

var cli = new CLIEngine( {
  fix: !!argv[ 'fix' ],
  useEslintrc: false,
  rules: {}
} )

// console.log( argv )

if ( argv._.length <= 0 ) {
  argv._.push( '**/*.js' ) // default all js files
}

var report = cli.executeOnFiles( argv._ )

// console.log( 'fixable count: ' + report.fixableErrorCount )

report.results.forEach( function ( result ) {
  var file = result.filePath

  var buffer = ''

  result.messages.forEach( function ( msg ) {
    buffer += (
      '  ' + file + ':' + msg.line + ':' + msg.column + ': ' + msg.message + '\n'
    )
  } )

  process.stderr.write( buffer )
} )

if ( report.errorCount !== 0 ) {
  process.exit( 1 )
} else {
  process.exit( 0 )
}
