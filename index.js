#!/usr/bin/env node

var readJson = require('read-package-json')
var program = require('commander');
var semver = require('semver');
var pkg = require('./package');

var allData = {};
var mainFile = null;
var remainingFiles = null;
var count = 0;
var total = 0;
var mergeKeys = ['dependencies', 'devDependencies'];
var output = {};

program
  .version(pkg.version)
  .arguments('<primary> [files...]')
  .option('-o, --out', 'Output to file')
  .option('-f, --force', 'Overwriting existing files')
  .action((primary, files) => {
    // urlValue = url
    // outputDir = output ? path.resolve(output) : process.cwd()
    console.log(primary, files)
    mainFile = primary;
    remainingFiles = files;
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
  for (var i = 0; i < remainingFiles.length; i++) {
    var file = remainingFiles[i];
    var data = allData[file];
    for ( var j = mergeKeys.length - 1; j >= 0; j--) {
      if( data[mergeKeys[j]] !== undefined ){
        var pkgKey = data[mergeKeys[j]];
        if( output[mergeKeys[j]] === undefined ){
          output[mergeKeys[j]] = {};
        }
        var packages = Object.keys(pkgKey);
        for (var k = 0; k < packages.length; k++) {
          if( output[mergeKeys[j]][packages[k]] === undefined ){
            output[mergeKeys[j]][packages[k]] = pkgKey[packages[k]];
          } else {
            output[mergeKeys[j]][packages[k]] = comapreVersion(output[mergeKeys[j]][packages[k]], pkgKey[packages[k]])
          }
        }
      }
    }
  }
  console.log(output)
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
