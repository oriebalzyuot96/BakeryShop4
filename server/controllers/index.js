var normalizedPath = require('path').join(__dirname)//direction
//
require('fs')
  .readdirSync(normalizedPath)
  .forEach(function(file) {
    if (!file.includes('index')) {
      var moduleName = file.split('.')[0] //without js
      exports[moduleName] = require('./' + moduleName)
    }
  })
