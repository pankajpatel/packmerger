var readJson = require('read-package-json')
var argv = require('minimist')(process.argv.slice(2))
var program = require('commander');
var pkg = require('./package');

program
  .version(pkg.version)
  .arguments('<url> [output-dir]')
  .option('-o, --out', 'Output to file')
  .option('-f, --force', 'Overwriting existing files')
  .action((url, output) => {
    urlValue = url
    outputDir = output ? path.resolve(output) : process.cwd()
  })
program.parse(process.argv)


// readJson(filename, [logFunction=noop], [strict=false], cb)
readJson('./package.json', console.error, false, function (er, data) {
  if (er) {
    console.error("There was an error reading the file")
    return
  }

  console.error('the package data is', data)
});
