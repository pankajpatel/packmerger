#!/usr/bin/env node

var readJson = require('read-package-json')
var argv = require('minimist')(process.argv.slice(2))
var program = require('commander');
var pkg = require('./package');

var allData = {};
var count = 0;
var total = 0;

program
  .version(pkg.version)
  .arguments('<primary> [files...]')
  .option('-o, --out', 'Output to file')
  .option('-f, --force', 'Overwriting existing files')
  .action((primary, files) => {
    // urlValue = url
    // outputDir = output ? path.resolve(output) : process.cwd()
    console.log(primary, files)
    total = files.length + 1;
    getData(primary, files)
  })
program.parse(process.argv)

if (process.argv.slice(2).length < 1) {
  program.outputHelp()
  process.exit()
}

function getData(primary, files) {
  // readJson(filename, [logFunction=noop], [strict=false], cb)
  readJsonFile(primary, prepareData)
  for (var i = files.length - 1; i >= 0; i--) {
    readJsonFile(files[i], prepareData)
  }
}

function readJsonFile(file, callback) {
  readJson(file, console.error, false, function (er, data) {
    if (er) {
      console.error("There was an error reading the file")
      return;
    }
    callback(file, data)
  });
}

function prepareData(file, data, callback) {
  allData[file] = data;
  count++;

  if( callback ){
    callback()
  }

  if(count == total ){
    finallyDoMerge()
  }
}

function finallyDoMerge() {
  console.log(count, allData)


}

function comapreVersion(version1, version2){
  let rev1 = version1.substr(1).split('.');
  let rev2 = version2.substr(1).split('.');
  for(let i=0;i<3;i++){
    let n1=Number(rev1[i]);
    let n2=Number(rev2[i]);
    if(n1!==n2){
      if(n1>n2){
        return version1; 
      } else{
        return version2;
      }
      break;
    }
  }
}