#!/usr/bin/env node

var readJson = require('read-package-json')
var argv = require('minimist')(process.argv.slice(2))
var program = require('commander');
var pkg = require('./package');

program
  .version(pkg.version)
  .arguments('<primary> [files...]')
  .option('-o, --out', 'Output to file')
  .option('-f, --force', 'Overwriting existing files')
  .action((primary, files) => {
    // urlValue = url
    // outputDir = output ? path.resolve(output) : process.cwd()
    console.log(primary, files)
    getData()
  })
program.parse(process.argv)

if (process.argv.slice(2).length < 2) {
  program.outputHelp()
  process.exit()
}


function getData() {
  // readJson(filename, [logFunction=noop], [strict=false], cb)
  readJson('./package.json', console.error, false, function (er, data) {
    if (er) {
      console.error("There was an error reading the file")
      return
    }

    console.error('the package data is', data)
  });
}
