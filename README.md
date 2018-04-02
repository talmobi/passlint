[![npm](https://img.shields.io/npm/v/passlint.svg?maxAge=3600&style=flat-square)](https://www.npmjs.com/package/passlint)
[![npm](https://img.shields.io/npm/l/passlint.svg?maxAge=3600&style=flat-square)](https://github.com/talmobi/passlint/blob/master/LICENSE)

# passlint

Quickly check syntax errors with acorn ( syntax-error ) - if this fails your code is definitely not going to work, probably.

Default ECMAScript version is 6 ( 2015 ) - change it with `-e <number>` argument variable

## Easy to use
```bash
passlint **/*.js && echo 'no errors was found'
```

## Example
```bash
passlint **/*.js
  components/mics.js:245:7: Unexpected token
  js/admin-controller.js:2:1: Unexpected token
```

## API
```javascript
var passlint = require( 'passlint' )
var defaultEcmaVersion = 6 // 2015
var filename = 'test/output.js'
var text = require( 'fs' ).readFileSync( filename, 'utf8' )
var errline = passlint( text, defaultEcmaVersion )
if ( errline ) console.error( filename + errline )
```
```
  test/output.js:484:40: ParseError: Unexpected token
```

## Arguments
```
$ passlint --help
Usage: passlint [optinos]

Arguments:

--ecma-version, -e <number>     specify ecma version to check against
                                defaults to 6 ( 2015 )

                                example: `passlint -e 6 src/**`

--version, -V                   print version and exit

--help, -h                      help ( this text )
```

## Install

locally ( project specific, for use with npm scripts )
```bash
npm install passlint
```

globally
```bash
npm install -g passlint
```

## Why

To quickly capture absolutely essential errors. Some projects have messy or no linting rules at all.
Even with linting setup not everything gets fixed or gets forgotten.

passlint is the dirty final gate that needs to be passed for your code to run regardless of style rules.

## Alternatives

You can use node's `-c` flag for similar functionality.
Note the variablity between node versions, passlint tests against ES 2015 by default
and also formats the output more concisely.

```bash
node -c **/*.js
```

## How
[acorn](https://github.com/acornjs/acorn)

[syntax-error](https://github.com/browserify/syntax-error)

## Test
```
npm test
```
