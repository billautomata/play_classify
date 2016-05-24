var fs = require('fs')
var async = require('async')
var natural = require('natural')
var load_classifier = require('./load_classifier.js')
var convert_line = require('./convert_lines.js')
var mongojs = require('mongojs')

var db = mongojs('shake', ['scores_percent'])

db.on('connect', function () {
  console.log('database connected')
})
db.on('error', function (err) {
  console.log('database error', err)
})

var lines = fs.readFileSync('./play.tsv').toString().split('\r\n')
console.log(lines.length, 'lines.')
var data = []
lines.forEach(function (line) {
  if (line.split('\t').length !== 6) {
    console.log(line)
  } else {
    data.push(convert_line(line))
  }
})
console.log(data[1010])
console.log('done.')

var list_of_plays = []
data.forEach(function (o) {
  if (list_of_plays.indexOf(o.play) === -1) {
    list_of_plays.push(o.play)
  }
})
console.log('list of plays')
console.log(list_of_plays.join(', '))

var characters_per_play = {}
data.forEach(function (o) {
  if (o.who.length === 0) {
    return
  }
  if (characters_per_play[o.play] === undefined) {
    characters_per_play[o.play] = []
  }
  if (characters_per_play[o.play].indexOf(o.who) === -1) {
    characters_per_play[o.play].push(o.who)
  }
})
console.log('characters per play')
console.log(characters_per_play['Hamlet'])

var fns = []
  // for each character in each play
Object.keys(characters_per_play).forEach(function (play_name, play_idx) {
  var characters = characters_per_play[play_name]
  characters.forEach(function (character_name, character_idx) {
    // score_character
    fns.push(function (cb) {
      console.log('doing play', play_idx, 'of', Object.keys(characters_per_play).length)
      console.log('doing character', character_idx, 'of', characters.length)
      score_character(character_name, play_name, cb)
    })
  })
})
async.series(fns)

function score_character(character_name, play_name, cb) {

  // check the db to see if it is already found
  db.scores_percent.find({
    play: play_name,
    character: character_name
  }, function (err, docs) {
    if (docs.length === 0) {
      console.log('not found')

      console.log('////// ///// /// // /')
      console.log(character_name, play_name)
      var spoken_lines = []
      data.forEach(function (o) {
        if (o.play === play_name && o.who === character_name) {
          spoken_lines.push(o.text)
        }
      })

      console.log(spoken_lines.length, 'spoken lines')

      var scores = {}
      list_of_plays.forEach(function (play_name) {
        console.log(play_name, '/////////////////////////// percent scores')
        scores[play_name] = {
          true: 0,
          false: 0
        }
        var classifier = load_classifier(play_name)
        spoken_lines.forEach(function (line) {
          var o = classifier.classify(line)
          scores[play_name][o] += 1
        })
        scores[play_name].true /= spoken_lines.length
        scores[play_name].false /= spoken_lines.length
        console.log(scores[play_name])
      })
      var positive = []
      var negative = []
      Object.keys(scores).forEach(function (play_name) {
        scores[play_name].name = play_name
        positive.push(scores[play_name])
        negative.push(scores[play_name])
      })
      positive = positive.sort(function (a, b) {
        return b.true - a.true
      })
      negative = negative.sort(function (a, b) {
        return b.false - a.false
      })

      positive.forEach(function (p) {
        console.log([p.true, p.name].join('\t'))
      })

      db.scores_percent.save({
        play: play_name,
        character: character_name,
        scores: positive
      }, function (err, doc) {
        console.log('done saving', doc.character, doc.play)
        cb()
      })
    } else {
      console.log('found, do nothing.')
      cb()
    }
  })


}
