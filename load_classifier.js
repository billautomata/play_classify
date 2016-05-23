var fs = require('fs')
var natural = require('natural')
module.exports = function load(name){
  var o = JSON.parse(fs.readFileSync(['./saved/',name,'.json'].join('')).toString())
  return natural.BayesClassifier.restore(o.classifier)
}
