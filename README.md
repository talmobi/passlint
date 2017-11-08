
# passlint

Quickly check syntax errors with acorn ( syntax-error ) - if this fails your code is definitely not going to work, probably.

Default ECMAScript version is 6 ( 2015 ) - change it with `-e <number>` argument variable

# Easy to use
```bash
passlint **/*.js && echo 'no errors was found'
```

# Sample output
```bash
passlint **/*.js
  components/mics.js:245:7: Unexpected token
  js/admin-controller.js:2:1: Unexpected token
```

# Install

locally ( project specific, for use with npm scripts )
```bash
npm install passlint
```

globally
```bash
npm install -g passlint
```

# How

acorn, syntax-error
