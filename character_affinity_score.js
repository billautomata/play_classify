var fs = require('fs')
var async = require('async')
var natural = require('natural')
var load_classifier = require('./load_classifier.js')

var lines = fs.readFileSync('./play.tsv').toString().split('\r\n')
console.log(lines.length, 'lines.')
var data = []
lines.forEach(function(line){
  if(line.split('\t').length !== 6){
    console.log(line)
  } else {
    data.push(convert_line(line))
  }
})
console.log(data[1010])
console.log('done.')

var list_of_plays = []
data.forEach(function(o){
  if(list_of_plays.indexOf(o.play) === -1){
    list_of_plays.push(o.play)
  }
})
console.log('list of plays')
console.log(list_of_plays.join(', '))

list_of_plays.forEach(function(play_name){
  console.log(play_name,'///////////////////////////')
  var classifier = load_classifier(play_name)
})

var characters_per_play = {}
data.forEach(function(o){
  if(o.who.length === 0){
    return
  }
  if(characters_per_play[o.play] === undefined){
    characters_per_play[o.play] = []
  }
  if(characters_per_play[o.play].indexOf(o.who) === -1){
    characters_per_play[o.play].push(o.who)
  }
})
console.log(characters_per_play)

function convert_line(line){
  var l = line.split('\t')
  return {
    idx: l[0],
    play: l[1],
    sec1: l[2],
    sec2: l[3],
    who: l[4],
    text: l[5]
  }
}
