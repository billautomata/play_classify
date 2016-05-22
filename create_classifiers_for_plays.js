var fs = require('fs')
var async = require('async')
var natural = require('natural')

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
  var classifier = new natural.BayesClassifier()
  console.log('adding documents for', play_name)
  var percent_true = 0
  data.forEach(function(o,idx){
    var v = (o.play === play_name)
    classifier.addDocument(o.text, String(v))
    if(v === true){
      percent_true += 1
    }
  })
  console.log(percent_true, data.length)
  console.log('training', play_name)
  classifier.train()
  var hits = 0
  data.forEach(function(o){
    var test = classifier.classify(o.text)
    if(o.play === play_name && test === String(true)){
      hits += 1
    } else if(o.play !== play_name && test === String(false)){
      hits += 1
    }
  })
  console.log(hits,data.length,(hits/data.length))
  fs.writeFileSync('./saved/'+play_name+'.json', JSON.stringify({
    name: play_name,
    classifier: classifier
  }))
})

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


// var characters_per_play = {}
// data.forEach(function(o){
//   if(o.who.length === 0){
//     return
//   }
//   if(characters_per_play[o.play] === undefined){
//     characters_per_play[o.play] = []
//   }
//   if(characters_per_play[o.play].indexOf(o.who) === -1){
//     characters_per_play[o.play].push(o.who)
//   }
// })
// console.log(characters_per_play)
