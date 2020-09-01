var test = require( 'tape' )

var childProcess = require( 'child_process' )

var path = require( 'path' )

var cliPath = path.join( __dirname, '../bin/cli.js' )

function exec ( command, callback ) {
  childProcess.exec( command, function ( error, stdout, stderr ) {
    console.log( stdout )
    var buffer = ( stdout + stderr + '' ).trim()
    callback( error, buffer )
  } )
}

test( 'run CLI without args ( error )', function ( t ) {
  t.timeoutAfter( 1000 )

  exec( cliPath, function ( err, buffer ) {
    t.ok( err, 'error found' )
    t.equal( buffer, 'Error! no files supplied - try `passlint **/*.js`' )
    t.end()
  } )
} )

test( 'run CLI with 1 file ( error )', function ( t ) {
  t.timeoutAfter( 1000 )

  var file1 = path.relative( process.cwd(), path.join( __dirname, 'stage', 'app.js' ) )

  exec( cliPath + ' ' + file1, function ( err, buffer ) {
    t.ok( err, 'error found' )
    t.equal( buffer, './' + file1 + ':2:20: SyntaxError: Unexpected token (2:20)' )
    t.end()

    console.log()
    console.log( buffer )
    console.log()
  } )
} )

test( 'run CLI with 1 file ( success )', function ( t ) {
  t.timeoutAfter( 1000 )

  var file1 = path.relative( process.cwd(), path.join( __dirname, 'stage', 'bundle.js' ) )

  exec( cliPath + ' ' + file1, function ( err, buffer ) {
    t.error( err )
    t.equal( buffer, '' )
    t.end()
  } )
} )

test( 'run CLI with 2 files ( error )', function ( t ) {
  t.timeoutAfter( 1000 )

  var file1 = path.relative( process.cwd(), path.join( __dirname, 'stage', 'bundle.js' ) )
  var file2 = path.relative( process.cwd(), path.join( __dirname, 'stage', 'mics-error.js' ) )

  exec( cliPath + ' ' + file1 + ' ' + file2, function ( err, buffer ) {
    t.ok( err, 'error found' )
    t.equal( buffer, './' + file2 + ':245:6: SyntaxError: Unexpected token (245:6)' )
    t.end()
  } )
} )

test( 'run CLI with 2 files ( success )', function ( t ) {
  t.timeoutAfter( 1000 )

  var file1 = path.relative( process.cwd(), path.join( __dirname, 'stage', 'bundle.js' ) )
  var file2 = path.relative( process.cwd(), path.join( __dirname, 'stage', 'mics.js' ) )

  exec( cliPath + ' ' + file1 + ' ' + file2, function ( err, buffer ) {
    t.error( err )
    t.equal( buffer, '' )
    t.end()
  } )
} )

test( 'run CLI with * files ( error )', function ( t ) {
  t.timeoutAfter( 1000 )

  var file1 = path.relative( process.cwd(), path.join( __dirname, 'stage', 'app.js' ) )
  var file2 = path.relative( process.cwd(), path.join( __dirname, 'stage', 'mics-error.js' ) )

  var files = (
    'stage/app.js stage/bundle.js stage/mics-error.js stage/mics.js stage/miru-connect.js'
  )
    .split( ' ' )
    .map( function ( file ) {
      return path.relative( process.cwd(), path.join( __dirname, file ) )
    } )
    .join( ' ' )

  exec( cliPath + ' ' + files, function ( err, buffer ) {
    t.ok( err, 'error found' )
    t.equal(
      buffer,
      (
        ( './' + file1 + ':2:20: SyntaxError: Unexpected token (2:20)' ) +
        '\n  ' +
        ( './' + file2 + ':245:6: SyntaxError: Unexpected token (245:6)' )
      )
    )
    t.end()
  } )
} )

test( 'run CLI with 1 file (css) ( error )', function ( t ) {
  t.timeoutAfter( 1000 )

  var file1 = path.relative( process.cwd(), path.join( __dirname, 'stage', 'bundle-error.css' ) )

  exec( cliPath + ' ' + file1, function ( err, buffer ) {
    t.ok( err, 'error found' )
    t.equal( buffer, './' + file1 + ':40:20: error: Expected RBRACE at line 40, col 20.' )
    t.end()
  } )
} )

test( 'run CLI with 1 file (css) ( success )', function ( t ) {
  t.timeoutAfter( 1000 )

  var file1 = path.relative( process.cwd(), path.join( __dirname, 'stage', 'bundle.css' ) )

  exec( cliPath + ' ' + file1, function ( err, buffer ) {
    t.error( err )
    t.equal( buffer, '' )
    t.end()
  } )
} )

test( 'run CLI with 2 files globbed ( error )', function ( t ) {
  t.timeoutAfter( 1000 )

  var file2 = path.relative( process.cwd(), path.join( __dirname, 'stage', 'mics-error.js' ) )

  exec( cliPath + ' **/stage/mics*.js', function ( err, buffer ) {
    t.ok( err, 'error found' )
    t.equal( buffer, './' + file2 + ':245:6: SyntaxError: Unexpected token (245:6)' )
    t.end()

    console.log()
    console.log( buffer )
    console.log()
  } )
} )

test( 'run CLI with 2 files globbed ( success )', function ( t ) {
  t.timeoutAfter( 1000 )

  exec( cliPath + ' **/stage/*n*.js', function ( err, buffer ) {
    t.error( err )
    t.equal( buffer, '' )
    t.end()
  } )
} )

// absolute paths
test( 'absolute path -- run CLI without args ( error )', function ( t ) {
  t.timeoutAfter( 1000 )

  exec( cliPath + ' -P', function ( err, buffer ) {
    t.ok( err, 'error found' )
    t.equal( buffer, 'Error! no files supplied - try `passlint **/*.js`' )
    t.end()
  } )
} )

test( 'absolute path -- run CLI with 1 file ( error )', function ( t ) {
  t.timeoutAfter( 1000 )

  var file1 = path.relative( process.cwd(), path.join( __dirname, 'stage', 'app.js' ) )

  exec( cliPath + ' -P' + ' ' + file1, function ( err, buffer ) {
    t.ok( err, 'error found' )
    t.equal( buffer, path.resolve( file1 ) + ':2:20: SyntaxError: Unexpected token (2:20)' )
    t.end()

    console.log()
    console.log( buffer )
    console.log()
  } )
} )

test( 'absolute path -- run CLI with 1 file ( success )', function ( t ) {
  t.timeoutAfter( 1000 )

  var file1 = path.relative( process.cwd(), path.join( __dirname, 'stage', 'bundle.js' ) )

  exec( cliPath + ' -P' + ' ' + file1, function ( err, buffer ) {
    t.error( err )
    t.equal( buffer, '' )
    t.end()
  } )
} )

test( 'absolute path -- run CLI with 2 files ( error )', function ( t ) {
  t.timeoutAfter( 1000 )

  var file1 = path.relative( process.cwd(), path.join( __dirname, 'stage', 'bundle.js' ) )
  var file2 = path.relative( process.cwd(), path.join( __dirname, 'stage', 'mics-error.js' ) )

  exec( cliPath + ' -P' + ' ' + file1 + ' ' + file2, function ( err, buffer ) {
    t.ok( err, 'error found' )
    t.equal( buffer, path.resolve( file2 ) + ':245:6: SyntaxError: Unexpected token (245:6)' )
    t.end()
  } )
} )

test( 'absolute path -- run CLI with 2 files ( success )', function ( t ) {
  t.timeoutAfter( 1000 )

  var file1 = path.relative( process.cwd(), path.join( __dirname, 'stage', 'bundle.js' ) )
  var file2 = path.relative( process.cwd(), path.join( __dirname, 'stage', 'mics.js' ) )

  exec( cliPath + ' -P' + ' ' + file1 + ' ' + file2, function ( err, buffer ) {
    t.error( err )
    t.equal( buffer, '' )
    t.end()
  } )
} )

test( 'absolute path -- run CLI with * files ( error )', function ( t ) {
  t.timeoutAfter( 1000 )

  var file1 = path.relative( process.cwd(), path.join( __dirname, 'stage', 'app.js' ) )
  var file2 = path.relative( process.cwd(), path.join( __dirname, 'stage', 'mics-error.js' ) )

  var files = (
    'stage/app.js stage/bundle.js stage/mics-error.js stage/mics.js stage/miru-connect.js'
  )
    .split( ' ' )
    .map( function ( file ) {
      return path.relative( process.cwd(), path.join( __dirname, file ) )
    } )
    .join( ' ' )

  exec( cliPath + ' -P' + ' ' + files, function ( err, buffer ) {
    t.ok( err, 'error found' )
    t.equal(
      buffer,
      (
        ( path.resolve( file1 ) + ':2:20: SyntaxError: Unexpected token (2:20)' ) +
        '\n  ' +
        ( path.resolve( file2 ) + ':245:6: SyntaxError: Unexpected token (245:6)' )
      )
    )
    t.end()
  } )
} )

test( 'absolute path -- run CLI with 1 file (css) ( error )', function ( t ) {
  t.timeoutAfter( 1000 )

  var file1 = path.relative( process.cwd(), path.join( __dirname, 'stage', 'bundle-error.css' ) )

  exec( cliPath + ' -P' + ' ' + file1, function ( err, buffer ) {
    t.ok( err, 'error found' )
    t.equal( buffer, path.resolve( file1 ) + ':40:20: error: Expected RBRACE at line 40, col 20.' )
    t.end()
  } )
} )

test( 'absolute path -- run CLI with 1 file (css) ( success )', function ( t ) {
  t.timeoutAfter( 1000 )

  var file1 = path.relative( process.cwd(), path.join( __dirname, 'stage', 'bundle.css' ) )

  exec( cliPath + ' -P' + ' ' + file1, function ( err, buffer ) {
    t.error( err )
    t.equal( buffer, '' )
    t.end()
  } )
} )

test( 'absolute path -- run CLI with 2 files globbed ( error )', function ( t ) {
  t.timeoutAfter( 1000 )

  var file2 = path.relative( process.cwd(), path.join( __dirname, 'stage', 'mics-error.js' ) )

  exec( cliPath + ' -P' + ' **/stage/mics*.js', function ( err, buffer ) {
    t.ok( err, 'error found' )
    t.equal( buffer, path.resolve( file2 ) + ':245:6: SyntaxError: Unexpected token (245:6)' )
    t.end()

    console.log()
    console.log( buffer )
    console.log()
  } )
} )

test( 'absolute path -- run CLI with 2 files globbed ( success )', function ( t ) {
  t.timeoutAfter( 1000 )

  exec( cliPath + ' -P' + ' **/stage/*n*.js', function ( err, buffer ) {
    t.error( err )
    t.equal( buffer, '' )
    t.end()
  } )
} )
