#!/usr/bin/env node

const argv = require('yargs').argv;

console.log('usage:   fct ng1 component contact-form' )
console.log('argv:  ', argv._);


require('./core/fct').run({
  group: argv._[0], 
  typeAlias: argv._[1], 
  nameArg: argv._[2], 
  outputDirArg: argv._[3],
  flat: argv.flat,
  force: argv.force,
  prefix: argv.prefix,
});



process.exit(1)
