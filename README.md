
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

# Why

To quickly capture absolutely essential errors. Some projects have messy or no linting rules at all.
Even with linting setup not everything gets fixed or gets forgotten.

passlint is the dirty final gate that needs to be passed for your code to run regardless of style rules.

# Alternatives

You can use node's `-c` flag for similar functionality.
Note the variablity between node versions, passlint tests against ES 2015 by default
and also parses the output more concisely.

```bash
node -c **/*.js
```

# How

acorn, syntax-error
